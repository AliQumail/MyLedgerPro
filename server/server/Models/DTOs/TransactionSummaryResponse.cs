namespace server.Models.DTOs
{
    public class CustomersSummaryResponse
    {
        public string CustomerId { get; set; } = string.Empty; 
        public string CustomerName { set; get; } = string.Empty;
        public string CustomerEmail { set; get; } = string.Empty;
        public int ToTake { set; get; }
        public int ToGive { set; get; }
    }
}
