using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using server.Migrations;
using server.Models;
using server.Models.DTOs;
using server.Repositories.CustomerRepository;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        private readonly CashBookDbContext DbContext;
        private readonly ICustomerRepository customerRepository;

        public CustomerController(CashBookDbContext cashBookDbContext, ICustomerRepository _customerRepository)
        {
            DbContext = cashBookDbContext;
            customerRepository = _customerRepository;
        }

        [HttpPost]
        [Route("addcustomer")]
        public async Task<string> AddCustomer(AddCustomerDTO _customer) {
            var customer = new Customer()
            {
                Id = Guid.NewGuid(),
                UserId = _customer.UserId,
                Email = _customer.Email,
                PhoneNo = _customer.PhoneNo,
                Name = _customer.Name,
            };
            await customerRepository.AddCustomerAsync(customer);
            return "Customer added successfully";
        }
        
        [HttpGet]
        [Route("getcustomer")]
        public async Task<Customer?> GetCustomer(Guid id) {
            return await customerRepository.GetCustomerById(id);
        }

        [HttpPost]
        [Route("customers/summary")]
        public async Task<List<CustomersSummaryResponse>> GetCustomersSummary(UserIdRequest request )
        {
            List<CustomersSummaryResponse> CustomersSummaryList = new List<CustomersSummaryResponse>();
            var customers = await customerRepository.GetCustomersByUserId(request.Id);

            // Looping through customers 
            foreach (var customer in customers)
            {
                // Finding the total amount given to some customer 
                var totalGive = await DbContext.Transaction
                    .Where(u => u.CustomerId == customer.Id && u.UserId == request.Id && u.Status == "Give")
                    .SumAsync(u => u.Amount);


                // Finding the total amount taken from some customer
                var totalTake = await DbContext.Transaction
                    .Where(u => u.CustomerId == customer.Id  && u.UserId == request.Id && u.Status == "Take")
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
                    CustomerId = customer.Id.ToString(),
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
