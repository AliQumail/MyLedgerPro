namespace server.Models.DTOs
{
    public class CreateReminderScheduleDTO
    {
        public Guid UserId { get; set; }
        public List<Guid> CustomerIds { get; set; } = new List<Guid>();
        public string Frequency { get; set; } = string.Empty;
        public string TimeOfDay { get; set; } = string.Empty; // "HH:mm"
        public int? DayOfWeek { get; set; }
        public int? DayOfMonth { get; set; }
    }

    public class UpdateReminderScheduleDTO
    {
        public List<Guid> CustomerIds { get; set; } = new List<Guid>();
        public string Frequency { get; set; } = string.Empty;
        public string TimeOfDay { get; set; } = string.Empty;
        public int? DayOfWeek { get; set; }
        public int? DayOfMonth { get; set; }
        public bool IsActive { get; set; }
    }

    public class ReminderScheduleCustomerDTO
    {
        public string CustomerId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
    }

    public class ReminderScheduleResponseDTO
    {
        public string Id { get; set; } = string.Empty;
        public List<ReminderScheduleCustomerDTO> Customers { get; set; } = new List<ReminderScheduleCustomerDTO>();
        public string Frequency { get; set; } = string.Empty;
        public string TimeOfDay { get; set; } = string.Empty;
        public int? DayOfWeek { get; set; }
        public int? DayOfMonth { get; set; }
        public bool IsActive { get; set; }
        public DateTime NextRunAt { get; set; }
        public DateTime? LastRunAt { get; set; }
    }
}
