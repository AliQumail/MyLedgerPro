using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Models.DTOs;
using server.Models.DTOs.AuthDTOs;
using server.Repositories.AuthRepository;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly IAuthRepository authRepository;
        public AuthController(UserManager<ApplicationUser> _userManager, IAuthRepository _authRepository)
        {
            this.userManager = _userManager;
            this.authRepository = _authRepository;
        }

        private const int MaxAccounts = 20;

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDto)
        {
            var accountCount = userManager.Users.Count();
            if (accountCount >= MaxAccounts)
            {
                return BadRequest($"This demo is limited to {MaxAccounts} accounts. Please try again later.");
            }

            var identityUser = new ApplicationUser()
            {
                UserName = registerRequestDto.Username,
                Email = registerRequestDto.Email,
                Currency = "PKR",
            };

            var identityResult = await userManager.CreateAsync(identityUser, registerRequestDto.Password);

            if (identityResult.Succeeded)
            {
                return Ok("User has been registered");
            }

            return BadRequest("Something went wrong");

        }

        [HttpPost]
        [Route("login")]
        public async Task<LoginResponseDTO> Login([FromBody] LoginRequestDTO loginRequestDto)
        {
            var user = await userManager.FindByNameAsync(loginRequestDto.Username);
            if (user != null)
            {
                var checkPasswordResult = await userManager.CheckPasswordAsync(user, loginRequestDto.Password);
                if (checkPasswordResult)
                {
                    var roles = await userManager.GetRolesAsync(user);
                    var token = authRepository.CreateJwtToken(user);
                    if (token != null)
                    {
                        var loginResponse = new LoginResponseDTO()
                        {
                            Id = user.Id,
                            Username = user.UserName,
                            Email = user.Email,
                            Token = token,
                            Currency = string.IsNullOrEmpty(user.Currency) ? "PKR" : user.Currency,
                        };
                        return loginResponse;
                    }
                    else {
                        throw new Exception("Something went wrong while logging in");
                    }
                }
                else
                {
                    throw new Exception("Password doesn't match");
                }
            }
            else
            {
                throw new Exception("User not found");
            }

        }

        [HttpGet]
        [Route("profile")]
        public async Task<ProfileResponseDTO> GetProfile([FromQuery] string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            return new ProfileResponseDTO()
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Currency = string.IsNullOrEmpty(user.Currency) ? "PKR" : user.Currency,
            };
        }

        [HttpPut]
        [Route("profile")]
        public async Task<ProfileResponseDTO> UpdateProfile([FromQuery] string id, [FromBody] UpdateProfileDTO request)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (!string.Equals(user.UserName, request.Username, StringComparison.Ordinal))
            {
                var setUsernameResult = await userManager.SetUserNameAsync(user, request.Username);
                if (!setUsernameResult.Succeeded)
                {
                    throw new Exception("Failed to update username");
                }
            }

            if (!string.Equals(user.Email, request.Email, StringComparison.Ordinal))
            {
                var setEmailResult = await userManager.SetEmailAsync(user, request.Email);
                if (!setEmailResult.Succeeded)
                {
                    throw new Exception("Failed to update email");
                }
            }

            user.Currency = request.Currency;
            await userManager.UpdateAsync(user);

            return new ProfileResponseDTO()
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Currency = user.Currency,
            };
        }
    }
}
