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
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LyfieDbContext _context;
        private readonly IPasswordService _passwordService;

        public AuthController(LyfieDbContext context, IPasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        [HttpGet("me")]
        [Authorize] // This ensures only valid cookies get through
        public IActionResult GetCurrentUser()
        {
            // If the cookie is valid, .NET fills the 'User' object automatically
            return Ok(new { email = User.Identity?.Name });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            // 1. Check if the user already exists
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
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
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 4. Auto-login the user after registration
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.Email) };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            return Ok(new { message = "Registration successful", email = user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email);
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
    }
}
