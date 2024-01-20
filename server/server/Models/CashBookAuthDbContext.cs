using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace server.Models
{
    public class CashBookAuthDbContext: IdentityDbContext
    {
        public CashBookAuthDbContext(DbContextOptions<CashBookAuthDbContext> options) : base(options) { }
    }
}
