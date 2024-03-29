﻿using server.Models;
using server.Models.DTOs;

namespace server.Repositories.CustomerRepository
{
    public interface ICustomerRepository
    {
        public Task<Customer> AddCustomerAsync(Customer customer);
        public Task<Customer?> GetCustomerById(Guid id);
        public Task<List<Customer>?> GetCustomersByUserId(Guid id);
        public Task<bool> UpdateCustomerAsync(Guid id, AddCustomerDTO customer);
        public Task<bool> RemoveCustomerAsync(Guid id);
    }
}
