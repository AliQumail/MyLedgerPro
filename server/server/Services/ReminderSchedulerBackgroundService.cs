using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Services
{
    public class ReminderSchedulerBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory scopeFactory;
        private readonly ILogger<ReminderSchedulerBackgroundService> logger;
        private static readonly TimeSpan PollInterval = TimeSpan.FromMinutes(1);

        public ReminderSchedulerBackgroundService(IServiceScopeFactory _scopeFactory, ILogger<ReminderSchedulerBackgroundService> _logger)
        {
            scopeFactory = _scopeFactory;
            logger = _logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessDueSchedulesAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error while processing scheduled reminders");
                }

                try
                {
                    await Task.Delay(PollInterval, stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    // shutting down
                }
            }
        }

        private async Task ProcessDueSchedulesAsync(CancellationToken stoppingToken)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<CashBookDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            var now = DateTime.UtcNow;
            var dueSchedules = await dbContext.ReminderSchedule
                .Where(s => s.IsActive && s.NextRunAt <= now)
                .ToListAsync(stoppingToken);

            if (dueSchedules.Count == 0) return;

            foreach (var schedule in dueSchedules)
            {
                var customer = await dbContext.Customer.FindAsync(new object[] { schedule.CustomerId }, stoppingToken);
                if (customer == null || string.IsNullOrWhiteSpace(customer.Email))
                {
                    AdvanceOrDeactivate(schedule, now);
                    continue;
                }

                try
                {
                    var totalGive = await dbContext.Transaction
                        .Where(t => t.CustomerId == customer.Id && t.UserId == schedule.UserId && t.Status == "Give")
                        .SumAsync(t => t.Amount, stoppingToken);
                    var totalTake = await dbContext.Transaction
                        .Where(t => t.CustomerId == customer.Id && t.UserId == schedule.UserId && t.Status == "Take")
                        .SumAsync(t => t.Amount, stoppingToken);

                    var toTake = totalGive > totalTake ? totalGive - totalTake : 0;
                    var toGive = totalTake > totalGive ? totalTake - totalGive : 0;

                    var message = toTake > 0
                        ? $"Hi {customer.Name}, this is a friendly reminder that you have an outstanding balance of {toTake:N0} with us. Please arrange payment at your earliest convenience. Thank you! - MyLedgerPro"
                        : toGive > 0
                            ? $"Hi {customer.Name}, just a note that we owe you {toGive:N0}. We'll settle this soon. Thank you! - MyLedgerPro"
                            : $"Hi {customer.Name}, your account is fully settled. Thank you for being a valued customer! - MyLedgerPro";

                    await emailService.SendReminderEmailAsync(customer.Email, customer.Name, "Payment Reminder - MyLedgerPro", message);
                    logger.LogInformation("Sent scheduled reminder email to {Email} for customer {CustomerId}", customer.Email, customer.Id);
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to send scheduled reminder for schedule {ScheduleId}", schedule.Id);
                }

                schedule.LastRunAt = now;
                AdvanceOrDeactivate(schedule, now);
            }

            await dbContext.SaveChangesAsync(stoppingToken);
        }

        private void AdvanceOrDeactivate(ReminderSchedule schedule, DateTime now)
        {
            if (schedule.Frequency == "Once")
            {
                schedule.IsActive = false;
                return;
            }

            schedule.NextRunAt = ReminderScheduleCalculator.ComputeNextRunAt(
                schedule.Frequency, schedule.TimeOfDay, schedule.DayOfWeek, schedule.DayOfMonth, now);
        }
    }
}
