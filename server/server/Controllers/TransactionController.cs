using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DTOs;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly CashBookDbContext DbContext;
        public TransactionController(CashBookDbContext dBContext)
        {
            this.DbContext = dBContext;
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
            await DbContext.Transaction.AddAsync(transaction);
            DbContext.SaveChanges();
            return "Transaction added successfully";
        }



        [HttpPost]
        [Route("gettransaction")]
        public async Task<List<Transaction>> GetTransaction(GetTransactionRequest request)
        {
            var transactions = await DbContext.Transaction.Where(u => u.UserId == request.UserId && u.CustomerId == request.CustomerId).ToListAsync();            
            return transactions;
        }

        [HttpPost]
        [Route("gettransactionsbyuser")]
        public async Task<List<Transaction>> GetTransactionsByUser(GetTransactionsDTO _user){
            var transactions = await DbContext.Transaction.Where(u => u.UserId == _user.Id).ToListAsync();
            return transactions; 
        }

        
        [HttpDelete]
        [Route("deletetransaction/{id}")]
        public async Task<bool> DeleteTransaction(Guid id) {
            var transaction = await DbContext.Transaction.FindAsync(id);
            if (transaction != null)
            {
                DbContext.Transaction.Remove(transaction);
                await DbContext.SaveChangesAsync();
                return true;
            }
            else {
                return false;
            }
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
