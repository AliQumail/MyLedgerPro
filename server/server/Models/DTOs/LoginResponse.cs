namespace server.Models.DTOs
{
    public class LoginResponse
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }
}
