﻿namespace server.Models.DTOs
{
    public class TransactionSummaryResponse
    {
        public string CustomerName { set; get; } = string.Empty;
        public string CustomerEmail { set; get; } = string.Empty;
        public int ToTake { set; get; }
        public int ToGive { set; get; }
    }
}
