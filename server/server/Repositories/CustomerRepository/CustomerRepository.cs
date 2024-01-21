using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Repositories.CustomerRepository
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly CashBookDbContext DbContext;

        public CustomerRepository(CashBookDbContext cashBookDbContext)
        {
            DbContext = cashBookDbContext;
        }
        public async Task<Customer> AddCustomerAsync(Customer customer)
        {
            await DbContext.Customer.AddAsync(customer);
            await DbContext.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer?> GetCustomerById(Guid id)
        {
            var customer = await DbContext.Customer.SingleOrDefaultAsync(u => u.Id == id);
            if (customer != null)
            {
                return customer;
            }
            return null;

        }

        public async Task<List<Customer>?> GetCustomersByUserId(Guid id)
        {      
            var customers = await DbContext.Customer.Where(u => u.UserId == id).ToListAsync();
            return customers;
        }
    
    }
}
