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

        public async Task<bool> UpdateCustomerAsync(Customer customer)
        {
            var customerFound = await DbContext.Customer.SingleOrDefaultAsync(u => u.Id == customer.Id);
            if (customerFound != null ) 
            {
                customerFound.Email = customer.Email;
                customerFound.PhoneNo = customer.PhoneNo;
                customerFound.Name = customer.Name;
                await DbContext.SaveChangesAsync();
                return true; 
            }
            
            return false;
        }

        public async Task<bool> RemoveCustomerAsync(Guid id)
        {
            var customer = await DbContext.Customer.FindAsync(id);
            if (customer != null)
            {
                DbContext.Customer.Remove(customer);
                await DbContext.SaveChangesAsync();
                return true;
            }
            return false;
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
