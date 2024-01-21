using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models.DTOs.AuthDTOs;
using server.Repositories.AuthRepository;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly UserManager<IdentityUser> userManager;
        private readonly IAuthRepository authRepository;
        public AuthController(UserManager<IdentityUser> _userManager, IAuthRepository _authRepository)
        {
            this.userManager = _userManager;
            this.authRepository = _authRepository;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDto)
        {
            var identityUser = new IdentityUser()
            {
                UserName = registerRequestDto.Username,
                Email = registerRequestDto.Email,
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
    }
}
