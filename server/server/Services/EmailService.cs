using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace server.Services
{
    public interface IEmailService
    {
        Task SendReminderEmailAsync(string toEmail, string customerName, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;

        public EmailService(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        public async Task SendReminderEmailAsync(string toEmail, string customerName, string subject, string body)
        {
            var host = configuration["Smtp:Host"];
            var port = int.Parse(configuration["Smtp:Port"] ?? "587");
            var username = configuration["Smtp:Username"];
            var appPassword = configuration["Smtp:AppPassword"];
            var fromName = configuration["Smtp:FromName"] ?? "MyLedgerPro";

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(appPassword))
            {
                throw new Exception("Email is not configured on the server yet.");
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, username));
            message.To.Add(new MailboxAddress(customerName, toEmail));
            message.Subject = subject;
            message.Body = new TextPart("plain") { Text = body };

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(username, appPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
