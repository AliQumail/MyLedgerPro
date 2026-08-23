namespace server.Models.DTOs.AuthDTOs
{
    public class UpdateProfileDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
    }

    public class ProfileResponseDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
    }
}
