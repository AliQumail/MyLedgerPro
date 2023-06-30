namespace server.Models
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int Amount { get; set; }

        public DateTime Date { get; set; }

    }
}
