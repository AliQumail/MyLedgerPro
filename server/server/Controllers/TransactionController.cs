using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.DTOs;
using server.Repositories.TransactionRepository;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly CashBookDbContext DbContext;
        private readonly ITransactionRepository transactionRepository;
        private readonly IReminderScheduleCleanupService reminderScheduleCleanupService;
        public TransactionController(
            CashBookDbContext dBContext,
            ITransactionRepository _transactionRepository,
            IReminderScheduleCleanupService _reminderScheduleCleanupService)
        {
            this.DbContext = dBContext;
            this.transactionRepository = _transactionRepository;
            this.reminderScheduleCleanupService = _reminderScheduleCleanupService;
        }

        [HttpPost]
        [Route("addtransaction")]
        public async Task<IActionResult> AddTransaction(AddTransactionDTO _transaction)
        {
            var transaction = new Transaction()
            {
                CustomerId = _transaction.CustomerId,
                UserId = _transaction.UserId,
                Status = _transaction.Status,
                Amount = _transaction.Amount,
                Date = DateTime.Now,
            };

            try
            {
                await transactionRepository.AddTransactionAsync(transaction);
                await reminderScheduleCleanupService.PruneClearedCustomerAsync(transaction.UserId, transaction.CustomerId);
                return Ok("Transaction added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("GetCustomerTransactionsByUser")]
        public async Task<List<Transaction>?> GetTransaction(GetTransactionRequest request)
        {
            return await transactionRepository.GetCustomerTransactionsByUserId(request.UserId, request.CustomerId);
        }

        [HttpDelete]
        [Route("deletetransaction/{id}")]
        public async Task<bool> DeleteTransaction(Guid id) {
            var transaction = await transactionRepository.RemoveTransactionAsync(id);
            if (transaction != null)
            {
                await reminderScheduleCleanupService.PruneClearedCustomerAsync(transaction.UserId, transaction.CustomerId);
                return true;
            }
            return false;
        }

        [HttpPut]
        [Route("UpdateTransaction")]
        public async Task<bool> UpdateTransaction([FromQuery] Guid id, [FromBody] UpdateTransactionDTO request) {
            var transaction = await transactionRepository.UpdateTransactionAsync(id, request);
            if (transaction != null)
            {
                await reminderScheduleCleanupService.PruneClearedCustomerAsync(transaction.UserId, transaction.CustomerId);
                return true;
            }
            return false;
        }

    }
}
