using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using server.Models;
using server.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly CashBookDbContext dbContext;
        private readonly IConfiguration _configuration;
        public UserController(CashBookDbContext dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("register")]
        public async Task<string> Register(RegisterUserDTO _user)
        {
            try
            {
                if (_user == null) throw new ArgumentNullException("user");
                var user = new User()
                {
                    Id = Guid.NewGuid(),
                    PhoneNo = _user.PhoneNo,
                    Email = _user.Email,
                    Name = _user.Name, 
                    Password = _user.Password,
                };

                await dbContext.User.AddAsync(user);
                dbContext.SaveChanges();


                return "User added successfully";  
            }
            catch
            {
                throw new Exception();
            }
        }


        [HttpPost]
        [Route("login")]
        public async Task<string> Login(LoginUserDTO _user) {

            var user = await dbContext.User.SingleOrDefaultAsync(u => u.Email == _user.Email);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            if ( user.Password != _user.Password) {
                throw new Exception("Password doesn't match"); 
            }

            string token = CreateToken(user);
            return token; 
        }

        private string CreateToken(User user)
        {
            try
            {
                List<Claim> claims = new()
                {
                    new Claim(ClaimTypes.Email, user.Email),
                   // new Claim(ClaimTypes.Role, user.Role),
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    _configuration.GetSection("AppSettings:Token").Value!));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                // token expires every 30 seconds 
                var token = new JwtSecurityToken(
                        claims: claims,
                        expires: DateTime.Now.AddSeconds(29),
                        signingCredentials: creds
                    );

                var jwt = new JwtSecurityTokenHandler().WriteToken(token);
                return jwt;

            }
            catch
            {
                throw new Exception();
            }
        }




       



    }

       
        
}
