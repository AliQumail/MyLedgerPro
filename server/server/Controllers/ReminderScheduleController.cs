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
        private const int MaxSchedulesPerUser = 20;

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

            var customerIds = schedules.Select(s => s.CustomerId).ToList();
            var customers = await DbContext.Customer
                .Where(c => customerIds.Contains(c.Id))
                .ToDictionaryAsync(c => c.Id, c => c.Name);

            return schedules.Select(s => new ReminderScheduleResponseDTO
            {
                Id = s.Id.ToString(),
                CustomerId = s.CustomerId.ToString(),
                CustomerName = customers.ContainsKey(s.CustomerId) ? customers[s.CustomerId] : "(deleted customer)",
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
            var existingCount = await DbContext.ReminderSchedule.CountAsync(s => s.UserId == request.UserId);
            if (existingCount >= MaxSchedulesPerUser)
            {
                return BadRequest($"This demo is limited to {MaxSchedulesPerUser} scheduled reminders per account");
            }

            if (!TimeSpan.TryParse(request.TimeOfDay, out var timeOfDay))
            {
                return BadRequest("Invalid time of day");
            }

            var nextRunAt = ReminderScheduleCalculator.ComputeNextRunAt(
                request.Frequency, timeOfDay, request.DayOfWeek, request.DayOfMonth, DateTime.UtcNow);

            var schedule = new ReminderSchedule
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                CustomerId = request.CustomerId,
                Frequency = request.Frequency,
                TimeOfDay = timeOfDay,
                DayOfWeek = request.DayOfWeek,
                DayOfMonth = request.DayOfMonth,
                IsActive = true,
                NextRunAt = nextRunAt,
                CreatedAt = DateTime.UtcNow,
            };

            DbContext.ReminderSchedule.Add(schedule);
            await DbContext.SaveChangesAsync();

            return Ok("Reminder schedule created");
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

            schedule.Frequency = request.Frequency;
            schedule.TimeOfDay = timeOfDay;
            schedule.DayOfWeek = request.DayOfWeek;
            schedule.DayOfMonth = request.DayOfMonth;
            schedule.IsActive = request.IsActive;
            schedule.NextRunAt = ReminderScheduleCalculator.ComputeNextRunAt(
                request.Frequency, timeOfDay, request.DayOfWeek, request.DayOfMonth, DateTime.UtcNow);

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

            DbContext.ReminderSchedule.Remove(schedule);
            await DbContext.SaveChangesAsync();
            return Ok("Reminder schedule deleted");
        }
    }
}
