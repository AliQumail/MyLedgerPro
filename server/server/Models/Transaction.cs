namespace server.Models
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid CustomerId { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Amount { get; set; }

        public DateTime Date { get; set; }

    }
}
