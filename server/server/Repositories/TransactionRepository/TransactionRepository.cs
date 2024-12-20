﻿using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DTOs;

namespace server.Repositories.TransactionRepository
{
    public class TransactionRepository : ITransactionRepository
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
            var userIdParam = new SqlParameter("@UserId", userId);
            var customerIdParam = new SqlParameter("@CustomerId", customerId);

            var transactions = await DbContext.Transaction
                .FromSqlRaw("EXEC GetCustomerTransactionsByUser @UserId, @CustomerId", userIdParam, customerIdParam)
                .ToListAsync();

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

        public async Task<bool> UpdateTransactionAsync(Guid id, UpdateTransactionDTO request) 
        {
            var transaction = await DbContext.Transaction.FindAsync(id);
            if (transaction != null)
            {
                transaction.Status = request.Status;
                transaction.Amount = request.Amount;
                transaction.Date = DateTime.Now;

                await DbContext.SaveChangesAsync(); 
                return true;
            }

            return false;
        }
    }
}
