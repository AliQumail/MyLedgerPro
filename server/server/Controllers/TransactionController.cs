using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DTOs;
using server.Repositories.TransactionRepository;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly CashBookDbContext DbContext;
        private readonly ITransactionRepository transactionRepository;
        public TransactionController(CashBookDbContext dBContext, ITransactionRepository _transactionRepository)
        {
            this.DbContext = dBContext;
            this.transactionRepository = _transactionRepository;
        }

        [HttpPost]
        [Route("addtransaction")]
        public async Task<string> AddTransaction(AddTransactionDTO _transaction) 
        {
            var transaction = new Transaction()
            {
                CustomerId = _transaction.CustomerId,
                UserId = _transaction.UserId,
                Status = _transaction.Status,
                Amount = _transaction.Amount,
                Date = DateTime.Now,
            };
            await transactionRepository.AddTransactionAsync(transaction);
            return "Transaction added successfully";
        }



        [HttpPost]
        [Route("gettransaction")]
        public async Task<List<Transaction>?> GetTransaction(GetTransactionRequest request)
        {
            return await transactionRepository.GetCustomerTransactionsByUserId(request.UserId, request.CustomerId);
        }
        
        [HttpDelete]
        [Route("deletetransaction/{id}")]
        public async Task<bool> DeleteTransaction(Guid id) {
            return await transactionRepository.RemoveTransactionAsync(id);
        }

        [HttpPut]
        [Route("updatetransaction")]
        public async Task<bool> UpdateTransaction(Guid id, UpdateTransactionDTO request) {

            var transaction = await DbContext.Transaction.FindAsync(id);
            if (transaction != null)
            {
                transaction.Status = request.Status;
                transaction.Amount = request.Amount;

                await DbContext.SaveChangesAsync();

                return true;
            }

            return false; 
        }
        
    }
}
