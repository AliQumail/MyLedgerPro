using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
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


        [HttpPost]
        [Route("getcustomer")]
        public async Task<Customer> GetCustomer(UserEmailRequest request) {
            var customer = await DbContext.Customer.SingleOrDefaultAsync(u => u.Email == request.Email);
            return customer; 
        }

        [HttpPost]
        [Route("getcustomersummary")]
        public async Task<List<CustomersSummaryResponse>> GetCustomersSummary(UserEmailRequest request)
        {

            List<CustomersSummaryResponse> CustomersSummaryList = new List<CustomersSummaryResponse>();

            // Finding all the customers of the given user by email 
            var customers = await DbContext.Customer.Where(u => u.UserEmail
            == request.Email ).ToListAsync();


            // Looping through customers 
            foreach (var customer in customers)
            {
                // Finding the total amount given to some customer 
                var totalGive = await DbContext.Transaction
                    .Where(u => u.CustomerEmail == customer.Email && u.UserEmail == request.Email && u.Status == "Give")
                    .SumAsync(u => u.Amount);


                // Finding the total amount taken from some customer
                var totalTake = await DbContext.Transaction
                    .Where(u => u.CustomerEmail == customer.Email  && u.UserEmail == request.Email && u.Status == "Take")
                    .SumAsync(u => u.Amount);

                var toTake = 0;
                var toGive = 0;
                if (totalTake > totalGive)
                {
                    toGive = totalTake - totalGive;
                    toTake = 0;
                }
                else {

                    toTake = totalGive - totalTake;
                    toGive = 0;

                }
                // Create a new object for returning some values 
                var CustomersSummaryResponse = new CustomersSummaryResponse() {
                    CustomerName = customer.Name,
                    CustomerEmail = customer.Email,
                    ToTake = toTake,
                    ToGive = toGive
                };

                CustomersSummaryList.Add(CustomersSummaryResponse);

            }

            return CustomersSummaryList;
        }

    }
}
