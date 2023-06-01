using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DTOs;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        private readonly CashBookDbContext DbContext;

        public CustomerController(CashBookDbContext cashBookDbContext)
        {
            DbContext = cashBookDbContext;
        }
        
        [HttpPost]
        [Route("addcustomer")]
        public async Task<string> AddCustomer(AddCustomerDTO _customer) {
            
            var customer = new Customer() {
               Id = Guid.NewGuid(),
               UserEmail = _customer.UserEmail,
               Email = _customer.Email,
               PhoneNo = _customer.PhoneNo,
               Name = _customer.Name,
            };

            await DbContext.Customer.AddAsync(customer);
            DbContext.SaveChanges();
            return "Customer added successfully";
        }


        [HttpPost]
        [Route("getcustomersbyuser")]
        public async Task<List<Customer>> GetCustomersByUser(GetCustomersByUserDTO _user)
        {
            var customers = await DbContext.Customer.Where(u => u.UserEmail == _user.Email).ToListAsync();
            return customers;
        }

    }
}
