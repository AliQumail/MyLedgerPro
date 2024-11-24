using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DTOs;

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
            var customerFound = await DbContext.Customer.SingleOrDefaultAsync(x => x.Email == customer.Email && x.UserId == customer.UserId);
            if (customerFound != null)
            {
                throw new Exception("Customer already exists");
            }

            await DbContext.Customer.AddAsync(customer);
            await DbContext.SaveChangesAsync();
            return customer;
        }

        public async Task<bool> UpdateCustomerAsync(Guid id, AddCustomerDTO customer)
        {
            var emailDuplicate = await DbContext.Customer.AnyAsync(u => u.Email == customer.Email && u.Id != id && customer.UserId == u.UserId);

            if (emailDuplicate)
            {
                throw new Exception("Email already exists");
            }
            var customerFound = await DbContext.Customer.SingleOrDefaultAsync(u => u.Id == id);
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
            var userIdParam = new SqlParameter("@UserId", id);
            var customers = await DbContext.Customer.FromSqlRaw("GetCustomersByUser @UserId", userIdParam).ToListAsync();
            return customers;
        }
    
    }
}
