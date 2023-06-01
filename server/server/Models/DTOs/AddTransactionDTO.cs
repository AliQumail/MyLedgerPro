namespace server.Models.DTOs
{
    public class AddTransactionDTO
    {
        public string UserEmail { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int Amount { get; set; }
    }
}
