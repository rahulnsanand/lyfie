using lyfie.core.DTOs;
using lyfie.core.Entities;
using lyfie.core.Interfaces;
using lyfie.data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace lyfie.api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly LyfieDbContext _dbcontext;
        private readonly IPasswordService _passwordService;

        public AuthController(LyfieDbContext context, IPasswordService passwordService)
        {
            _dbcontext = context;
            _passwordService = passwordService;
        }

        [HttpGet("status")]
        public IActionResult GetCurrentUser()
        {
            if (User.Identity is { IsAuthenticated: true })
            {
                return Ok(new
                {
                    email = User.Identity.Name,
                    id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                });
            }

            return Unauthorized(new { message = "Session expired or user not logged in." });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            // 1. Check if the user already exists
            if (await _dbcontext.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest(new { message = "Email is already in use." });
            }

            // 2. Hash the password using Argon2 service
            var user = new LyfieUser
            {
                Email = model.Email,
                PasswordHash = _passwordService.HashPassword(model.Password),
                CreatedAt = DateTime.UtcNow
            };

            // 3. Save to database
            _dbcontext.Users.Add(user);
            await _dbcontext.SaveChangesAsync();

            // 4. Auto-login the user after registration
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.Email) };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            return Ok(new { message = "Registration successful", email = user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var user = await _dbcontext.Users.SingleOrDefaultAsync(u => u.Email == model.Email);
            if (user == null || !_passwordService.VerifyPassword(model.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.Email) };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity));

            return Ok(new { email = user.Email });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }


        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword()
        {
            return Ok();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword()
        {
            return Ok();
        }

        [HttpDelete("reset-pin")]
        public async Task<IActionResult> ResetPin()
        {
            return Ok();
        }

        [HttpPost("set-pin")]
        public async Task<IActionResult> SetPin()
        {
            return Ok();
        }

        [HttpPut("change-pin")]
        public async Task<IActionResult> ChangePin()
        {
            return Ok();
        }
    }
}
