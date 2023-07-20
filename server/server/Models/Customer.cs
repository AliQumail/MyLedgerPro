namespace server.Models
{
    public class Customer
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty;

        public Guid UserId { get; set; } 

    }
}
