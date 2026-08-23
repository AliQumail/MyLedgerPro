using server.Models;
using server.Models.DTOs;

namespace server.Repositories.TransactionRepository
{
    public interface ITransactionRepository
    {
        public Task<Transaction> AddTransactionAsync(Transaction transaction);
        public Task<List<Transaction>?> GetCustomerTransactionsByUserId(Guid userId, Guid customerId);
        public Task<Transaction?> RemoveTransactionAsync(Guid id);
        public Task<Transaction?> UpdateTransactionAsync(Guid id, UpdateTransactionDTO request);
    }
}
