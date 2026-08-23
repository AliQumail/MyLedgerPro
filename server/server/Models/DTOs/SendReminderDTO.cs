namespace server.Models.DTOs
{
    public class SendReminderDTO
    {
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
