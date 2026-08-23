using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DTOs;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReminderScheduleController : ControllerBase
    {
        private readonly CashBookDbContext DbContext;
        private const int MaxSchedulesPerUser = 10;

        public ReminderScheduleController(CashBookDbContext dbContext)
        {
            DbContext = dbContext;
        }

        [HttpGet]
        [Route("list")]
        public async Task<List<ReminderScheduleResponseDTO>> List([FromQuery] Guid userId)
        {
            var schedules = await DbContext.ReminderSchedule
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.NextRunAt)
                .ToListAsync();

            var scheduleIds = schedules.Select(s => s.Id).ToList();
            var links = await DbContext.ReminderScheduleCustomer
                .Where(l => scheduleIds.Contains(l.ReminderScheduleId))
                .ToListAsync();

            var customerIds = links.Select(l => l.CustomerId).Distinct().ToList();
            var customers = await DbContext.Customer
                .Where(c => customerIds.Contains(c.Id))
                .ToDictionaryAsync(c => c.Id, c => c.Name);

            return schedules.Select(s => new ReminderScheduleResponseDTO
            {
                Id = s.Id.ToString(),
                Customers = links
                    .Where(l => l.ReminderScheduleId == s.Id)
                    .Select(l => new ReminderScheduleCustomerDTO
                    {
                        CustomerId = l.CustomerId.ToString(),
                        CustomerName = customers.ContainsKey(l.CustomerId) ? customers[l.CustomerId] : "(deleted customer)",
                    })
                    .ToList(),
                Frequency = s.Frequency,
                TimeOfDay = s.TimeOfDay.ToString(@"hh\:mm"),
                DayOfWeek = s.DayOfWeek,
                DayOfMonth = s.DayOfMonth,
                IsActive = s.IsActive,
                NextRunAt = s.NextRunAt,
                LastRunAt = s.LastRunAt,
            }).ToList();
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] CreateReminderScheduleDTO request)
        {
            var customerIds = request.CustomerIds.Distinct().ToList();
            if (customerIds.Count == 0)
            {
                return BadRequest("Select at least one customer");
            }

            if (!TimeSpan.TryParse(request.TimeOfDay, out var timeOfDay))
            {
                return BadRequest("Invalid time of day");
            }

            var existingCount = await DbContext.ReminderSchedule.CountAsync(s => s.UserId == request.UserId);
            if (existingCount >= MaxSchedulesPerUser)
            {
                return BadRequest($"This demo is limited to {MaxSchedulesPerUser} scheduled reminders per account");
            }

            var alreadyScheduledCustomerIds = await DbContext.ReminderScheduleCustomer
                .Where(l => customerIds.Contains(l.CustomerId))
                .Join(DbContext.ReminderSchedule.Where(s => s.UserId == request.UserId),
                    l => l.ReminderScheduleId, s => s.Id, (l, s) => l.CustomerId)
                .Distinct()
                .ToListAsync();

            if (alreadyScheduledCustomerIds.Count > 0)
            {
                var names = await DbContext.Customer
                    .Where(c => alreadyScheduledCustomerIds.Contains(c.Id))
                    .Select(c => c.Name)
                    .ToListAsync();
                return BadRequest($"Already scheduled for: {string.Join(", ", names)}");
            }

            var nextRunAt = ReminderScheduleCalculator.ComputeNextRunAt(
                request.Frequency, timeOfDay, request.DayOfWeek, request.DayOfMonth, DateTime.UtcNow);

            var schedule = new ReminderSchedule
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                Frequency = request.Frequency,
                TimeOfDay = timeOfDay,
                DayOfWeek = request.DayOfWeek,
                DayOfMonth = request.DayOfMonth,
                IsActive = true,
                NextRunAt = nextRunAt,
                CreatedAt = DateTime.UtcNow,
            };

            DbContext.ReminderSchedule.Add(schedule);
            DbContext.ReminderScheduleCustomer.AddRange(customerIds.Select(customerId => new ReminderScheduleCustomer
            {
                Id = Guid.NewGuid(),
                ReminderScheduleId = schedule.Id,
                CustomerId = customerId,
            }));

            await DbContext.SaveChangesAsync();

            return Ok($"Reminder schedule created for {customerIds.Count} customer(s)");
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> Update([FromQuery] Guid id, [FromBody] UpdateReminderScheduleDTO request)
        {
            var schedule = await DbContext.ReminderSchedule.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            if (!TimeSpan.TryParse(request.TimeOfDay, out var timeOfDay))
            {
                return BadRequest("Invalid time of day");
            }

            var customerIds = request.CustomerIds.Distinct().ToList();
            if (customerIds.Count == 0)
            {
                return BadRequest("Select at least one customer");
            }

            var alreadyScheduledCustomerIds = await DbContext.ReminderScheduleCustomer
                .Where(l => l.ReminderScheduleId != id && customerIds.Contains(l.CustomerId))
                .Join(DbContext.ReminderSchedule.Where(s => s.UserId == schedule.UserId),
                    l => l.ReminderScheduleId, s => s.Id, (l, s) => l.CustomerId)
                .Distinct()
                .ToListAsync();

            if (alreadyScheduledCustomerIds.Count > 0)
            {
                var names = await DbContext.Customer
                    .Where(c => alreadyScheduledCustomerIds.Contains(c.Id))
                    .Select(c => c.Name)
                    .ToListAsync();
                return BadRequest($"Already scheduled for: {string.Join(", ", names)}");
            }

            schedule.Frequency = request.Frequency;
            schedule.TimeOfDay = timeOfDay;
            schedule.DayOfWeek = request.DayOfWeek;
            schedule.DayOfMonth = request.DayOfMonth;
            schedule.IsActive = request.IsActive;
            schedule.NextRunAt = ReminderScheduleCalculator.ComputeNextRunAt(
                request.Frequency, timeOfDay, request.DayOfWeek, request.DayOfMonth, DateTime.UtcNow);

            var existingLinks = DbContext.ReminderScheduleCustomer.Where(l => l.ReminderScheduleId == id);
            DbContext.ReminderScheduleCustomer.RemoveRange(existingLinks);
            DbContext.ReminderScheduleCustomer.AddRange(customerIds.Select(customerId => new ReminderScheduleCustomer
            {
                Id = Guid.NewGuid(),
                ReminderScheduleId = id,
                CustomerId = customerId,
            }));

            await DbContext.SaveChangesAsync();
            return Ok("Reminder schedule updated");
        }

        [HttpPatch]
        [Route("toggle")]
        public async Task<IActionResult> Toggle([FromQuery] Guid id, [FromQuery] bool isActive)
        {
            var schedule = await DbContext.ReminderSchedule.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            schedule.IsActive = isActive;
            await DbContext.SaveChangesAsync();
            return Ok("Reminder schedule updated");
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> Delete([FromQuery] Guid id)
        {
            var schedule = await DbContext.ReminderSchedule.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            var links = DbContext.ReminderScheduleCustomer.Where(l => l.ReminderScheduleId == id);
            DbContext.ReminderScheduleCustomer.RemoveRange(links);
            DbContext.ReminderSchedule.Remove(schedule);
            await DbContext.SaveChangesAsync();
            return Ok("Reminder schedule deleted");
        }
    }
}
