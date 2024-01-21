using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Repositories.TransactionRepository
{
    public class TransactionRepository: ITransactionRepository
    {
        private readonly CashBookDbContext DbContext;

        public TransactionRepository(CashBookDbContext cashBookDbContext)
        {
            DbContext = cashBookDbContext;
        }
        public async Task<Transaction> AddTransactionAsync(Transaction transaction)
        {
            await DbContext.Transaction.AddAsync(transaction);
            await DbContext.SaveChangesAsync();
            return transaction; 
        }
        public async Task<List<Transaction>?> GetCustomerTransactionsByUserId(Guid userId, Guid customerId)
        {
            var transactions = await DbContext.Transaction.Where(u => u.UserId == userId && u.CustomerId == customerId).ToListAsync();
            return transactions;
        }

        public async Task<bool> RemoveTransactionAsync(Guid id)
        {
            var transaction = await DbContext.Transaction.FindAsync(id);
            if (transaction != null)
            {
                DbContext.Transaction.Remove(transaction);
                await DbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
