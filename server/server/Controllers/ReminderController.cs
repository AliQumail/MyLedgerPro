using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReminderController : ControllerBase
    {
        private readonly IEmailService emailService;

        public ReminderController(IEmailService _emailService)
        {
            emailService = _emailService;
        }

        [HttpPost]
        [Route("send-email")]
        public async Task<IActionResult> SendEmailReminder([FromBody] SendReminderDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.CustomerEmail))
            {
                return BadRequest("Customer does not have an email on file");
            }

            try
            {
                await emailService.SendReminderEmailAsync(
                    request.CustomerEmail,
                    request.CustomerName,
                    "Payment Reminder - MyLedgerPro",
                    request.Message
                );
                return Ok("Reminder email sent successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
