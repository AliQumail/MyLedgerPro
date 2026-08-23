using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Services
{
    public interface IReminderScheduleCleanupService
    {
        Task PruneClearedCustomerAsync(Guid userId, Guid customerId);
    }

    public class ReminderScheduleCleanupService : IReminderScheduleCleanupService
    {
        private readonly CashBookDbContext DbContext;

        public ReminderScheduleCleanupService(CashBookDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public async Task PruneClearedCustomerAsync(Guid userId, Guid customerId)
        {
            var totalGive = await DbContext.Transaction
                .Where(t => t.CustomerId == customerId && t.UserId == userId && t.Status == "Give")
                .SumAsync(t => t.Amount);
            var totalTake = await DbContext.Transaction
                .Where(t => t.CustomerId == customerId && t.UserId == userId && t.Status == "Take")
                .SumAsync(t => t.Amount);

            var toTake = totalGive > totalTake ? totalGive - totalTake : 0;
            if (toTake > 0)
            {
                // customer still owes money, nothing to prune
                return;
            }

            var linksForCustomer = await DbContext.ReminderScheduleCustomer
                .Where(l => l.CustomerId == customerId)
                .Join(DbContext.ReminderSchedule.Where(s => s.UserId == userId),
                    l => l.ReminderScheduleId, s => s.Id, (l, s) => l)
                .ToListAsync();

            if (linksForCustomer.Count == 0)
            {
                return;
            }

            var affectedScheduleIds = linksForCustomer.Select(l => l.ReminderScheduleId).Distinct().ToList();
            DbContext.ReminderScheduleCustomer.RemoveRange(linksForCustomer);
            await DbContext.SaveChangesAsync();

            var emptySchedules = await DbContext.ReminderSchedule
                .Where(s => affectedScheduleIds.Contains(s.Id))
                .Where(s => !DbContext.ReminderScheduleCustomer.Any(l => l.ReminderScheduleId == s.Id))
                .ToListAsync();

            if (emptySchedules.Count > 0)
            {
                DbContext.ReminderSchedule.RemoveRange(emptySchedules);
                await DbContext.SaveChangesAsync();
            }
        }
    }
}
