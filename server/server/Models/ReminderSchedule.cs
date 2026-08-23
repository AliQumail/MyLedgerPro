namespace server.Models
{
    public class ReminderSchedule
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Frequency { get; set; } = string.Empty; // Once, Daily, Weekly, Monthly
        public TimeSpan TimeOfDay { get; set; }
        public int? DayOfWeek { get; set; } // 0-6, used when Frequency = Weekly
        public int? DayOfMonth { get; set; } // 1-28, used when Frequency = Monthly
        public bool IsActive { get; set; } = true;
        public DateTime NextRunAt { get; set; }
        public DateTime? LastRunAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ReminderScheduleCustomer
    {
        public Guid Id { get; set; }
        public Guid ReminderScheduleId { get; set; }
        public Guid CustomerId { get; set; }
    }
}
