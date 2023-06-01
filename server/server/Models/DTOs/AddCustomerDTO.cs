namespace server.Models.DTOs
{
    public class AddCustomerDTO
    {
        public string UserEmail { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PhoneNo { get; set; }
    }
}
