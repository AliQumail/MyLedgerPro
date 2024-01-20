using Microsoft.AspNetCore.Identity;

namespace server.Repositories.AuthRepository
{
    public interface IAuthRepository
    {
        public string CreateJwtToken(IdentityUser user);
    }
}
