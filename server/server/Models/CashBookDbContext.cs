using Microsoft.EntityFrameworkCore;

namespace server.Models
{
    public class CashBookDbContext : DbContext
    {
        public CashBookDbContext(DbContextOptions<CashBookDbContext> options) : base(options) { }
        public DbSet<User> User { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<Transaction> Transaction { get; set; }
    }
}
