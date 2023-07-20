namespace server.Models.DTOs
{
    public class GetTransactionRequest
    {

        public Guid UserId { get; set; } 
        public Guid CustomerId { get; set; } 
     
    }
}
