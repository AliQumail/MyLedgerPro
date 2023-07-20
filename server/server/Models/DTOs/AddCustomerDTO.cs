﻿namespace server.Models.DTOs
{
    public class AddCustomerDTO
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty; 
    } 
}
