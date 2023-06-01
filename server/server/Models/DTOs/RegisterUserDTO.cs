namespace server.Models.DTOs
{
    public class RegisterUserDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PhoneNo { get; set;  } = string.Empty;
    }
}
