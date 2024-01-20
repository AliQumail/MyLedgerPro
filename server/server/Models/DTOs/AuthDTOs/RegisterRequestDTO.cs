using System.ComponentModel.DataAnnotations;

namespace server.Models.DTOs.AuthDTOs
{
    public class RegisterRequestDTO
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
