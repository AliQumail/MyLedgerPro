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
                CustomerEmail = _transaction.CustomerEmail,
                UserEmail = _transaction.UserEmail,
                Status = _transaction.Status,
                Amount = _transaction.Amount,
            };
            await DbContext.Transaction.AddAsync(transaction);
            DbContext.SaveChanges();
            return "Transaction added successfully";
        }

        [HttpPost]
        [Route("gettransactionsbyuser")]
        public async Task<List<Transaction>> GetTransactionsByUser(GetTransactionsDTO _user){
            var transactions = await DbContext.Transaction.Where(u => u.UserEmail == _user.Email).ToListAsync();
            return transactions; 
        }
    }
}
