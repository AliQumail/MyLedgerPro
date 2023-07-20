﻿namespace server.Models.DTOs
{
    public class AddTransactionDTO
    {
        public Guid UserId { get; set; } 
        public Guid CustomerId { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Amount { get; set; }
    }
}
