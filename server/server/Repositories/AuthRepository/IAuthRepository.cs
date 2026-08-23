using server.Models;

namespace server.Repositories.AuthRepository
{
    public interface IAuthRepository
    {
        public string CreateJwtToken(ApplicationUser user);
    }
}
