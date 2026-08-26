using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Services
{
    public interface IDemoResetService
    {
        Task ResetDemoUserAsync(Guid userId);
    }

    public class DemoResetService : IDemoResetService
    {
        private readonly CashBookDbContext DbContext;

        private static readonly (string Name, string Email, string Phone)[] SeedCustomers = new[]
        {
            ("James Anderson", "james.anderson@example.com", "07911234567"),
            ("Emily Clarke", "emily.clarke@example.com", "07921234567"),
            ("Michael Turner", "michael.turner@example.com", "07931234567"),
            ("Sarah Mitchell", "sarah.mitchell@example.com", "07941234567"),
            ("David Robinson", "david.robinson@example.com", "07951234567"),
            ("Olivia Bennett", "olivia.bennett@example.com", "07961234567"),
            ("Daniel Foster", "daniel.foster@example.com", "07971234567"),
        };

        private const int TransactionsPerCustomer = 15;

        public DemoResetService(CashBookDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public async Task ResetDemoUserAsync(Guid userId)
        {
            // Remove all existing data for this user
            var scheduleIds = await DbContext.ReminderSchedule
                .Where(s => s.UserId == userId)
                .Select(s => s.Id)
                .ToListAsync();

            if (scheduleIds.Count > 0)
            {
                var links = DbContext.ReminderScheduleCustomer.Where(l => scheduleIds.Contains(l.ReminderScheduleId));
                DbContext.ReminderScheduleCustomer.RemoveRange(links);
                var schedules = DbContext.ReminderSchedule.Where(s => s.UserId == userId);
                DbContext.ReminderSchedule.RemoveRange(schedules);
            }

            var transactions = DbContext.Transaction.Where(t => t.UserId == userId);
            DbContext.Transaction.RemoveRange(transactions);

            var customers = DbContext.Customer.Where(c => c.UserId == userId);
            DbContext.Customer.RemoveRange(customers);

            await DbContext.SaveChangesAsync();

            // Re-seed fresh
            var random = new Random();
            var newCustomers = SeedCustomers.Select(c => new Customer
            {
                Id = Guid.NewGuid(),
                Name = c.Name,
                Email = c.Email,
                PhoneNo = c.Phone,
                UserId = userId,
            }).ToList();

            DbContext.Customer.AddRange(newCustomers);

            var newTransactions = new List<Transaction>();
            foreach (var customer in newCustomers)
            {
                for (int i = 1; i <= TransactionsPerCustomer; i++)
                {
                    // Give amounts are kept larger than Take amounts so every seeded
                    // customer ends up owing money (ToTake > 0) and stays schedulable.
                    bool isTake = i % 2 == 0;
                    newTransactions.Add(new Transaction
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        CustomerId = customer.Id,
                        Status = isTake ? "Take" : "Give",
                        Amount = isTake ? 500 + random.Next(0, 4500) : 5000 + random.Next(0, 45000),
                        Date = DateTime.Now.AddDays(-random.Next(0, 90)),
                    });
                }
            }

            DbContext.Transaction.AddRange(newTransactions);

            var scheduleId = Guid.NewGuid();
            var nextMonday = NextWeekday(DateTime.UtcNow, DayOfWeek.Monday).Date.AddHours(12);

            var newSchedule = new ReminderSchedule
            {
                Id = scheduleId,
                UserId = userId,
                Frequency = "Weekly",
                TimeOfDay = new TimeSpan(12, 0, 0),
                DayOfWeek = (int)DayOfWeek.Monday,
                DayOfMonth = null,
                IsActive = false,
                NextRunAt = nextMonday,
                LastRunAt = null,
                CreatedAt = DateTime.UtcNow,
            };

            DbContext.ReminderSchedule.Add(newSchedule);
            DbContext.ReminderScheduleCustomer.AddRange(newCustomers.Select(c => new ReminderScheduleCustomer
            {
                Id = Guid.NewGuid(),
                ReminderScheduleId = scheduleId,
                CustomerId = c.Id,
            }));

            await DbContext.SaveChangesAsync();
        }

        private static DateTime NextWeekday(DateTime from, DayOfWeek targetDay)
        {
            int daysUntil = ((int)targetDay - (int)from.DayOfWeek + 7) % 7;
            return from.AddDays(daysUntil);
        }
    }
}
