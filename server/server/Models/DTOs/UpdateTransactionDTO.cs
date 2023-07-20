namespace server.Models.DTOs
{
    public class UpdateTransactionDTO
    {
        public string Status { get; set; } = string.Empty;
        public int Amount { get; set; }
    }
}
