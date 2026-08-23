using Microsoft.AspNetCore.Identity;

namespace server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Currency { get; set; } = "PKR";
    }
}
