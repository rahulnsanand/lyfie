using lyfie.core.DTOs;
using lyfie.core.Entities.Auth;
using lyfie.core.Entities.Users;
using lyfie.core.Enums.Authentication;
using lyfie.core.Interfaces;
using lyfie.data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly LyfieDbContext _dbcontext;
    private readonly IPasswordService _passwordService;
    private readonly SymmetricSecurityKey _signingKey;

    public AuthController(SymmetricSecurityKey signingKey,
        IPasswordService passwordService, LyfieDbContext context)
    {
        _signingKey = signingKey;
        _passwordService = passwordService;
        _dbcontext = context;
    }

    [HttpGet("status")]
    public IActionResult GetCurrentUser()
    {
        // Use User.Identity.IsAuthenticated check
        if (User.Identity?.IsAuthenticated == true)
        {
            return Ok(new
            {
                email = User.FindFirst(ClaimTypes.Email)?.Value,
                id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            });
        }

        return Unauthorized(new { message = "Session expired or user not logged in." });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO model)
    {
        if (await _dbcontext.Users.AnyAsync(u => u.Email == model.Email))
        {
            return BadRequest(new { message = "Email is already in use." });
        }

        var user = new LyfieUser
        {
            Name = model.Name,
            Email = model.Email,
            PasswordHash = _passwordService.HashPassword(model.Password),
            CreatedAt = DateTime.UtcNow
        };

        _dbcontext.Users.Add(user);

        // Log registration
        _dbcontext.AuthenticationLogs.Add(CreateLog(user.Id.ToString(), user.Email, AuthenticationCategory.Register));

        await _dbcontext.SaveChangesAsync();

        var token = AppendAuthCookie(user);

        return Ok(new
        {
            message = "Registered successfully",
            token = token, // Postman/Android will use this
            user = new { user.Email, user.Name } // Good for offline "Lite" profile
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO model)
    {
        var user = await _dbcontext.Users.SingleOrDefaultAsync(u => u.Email == model.Email);

        if (user == null || !_passwordService.VerifyPassword(model.Password, user.PasswordHash))
        {
            _dbcontext.AuthenticationLogs.Add(CreateLog("null", model.Email, AuthenticationCategory.FailedLogin));
            await _dbcontext.SaveChangesAsync();
            return Unauthorized(new { message = "Invalid email or password" });
        }

        _dbcontext.AuthenticationLogs.Add(CreateLog(user.Id.ToString(), user.Email, AuthenticationCategory.Login));
        await _dbcontext.SaveChangesAsync();

        var token = AppendAuthCookie(user);

        return Ok(new
        {
            message = "Logged in successfully",
            token = token, // Postman/Android will use this
            user = new { user.Email, user.Name } // Good for offline "Lite" profile
        });
    }

    [HttpPost("logout")]
    [Authorize] // Ensures only logged-in users can trigger a logout log
    public async Task<IActionResult> Logout()
    {
        // 1. Extract info from the JWT claims (which were pulled from the cookie)
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

        // 2. Log the logout event
        if (!string.IsNullOrEmpty(userIdString) && Guid.TryParse(userIdString, out Guid userId))
        {
            var authLog = new AuthenticationLog
            {
                UserId = userId.ToString(),
                UserEmail = userEmail ?? "Unknown",
                AuthenticationType = AuthenticationType.Password,
                AuthenticationCategory = AuthenticationCategory.Logout,
                LogTimestamp = DateTime.UtcNow
            };

            _dbcontext.AuthenticationLogs.Add(authLog);
            await _dbcontext.SaveChangesAsync();
        }

        // 3. Clear the Cookie
        // Use the same options (SameSite/Secure) used during creation to ensure browser compliance
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(-1) // Force immediate expiration
        };

        Response.Cookies.Delete("LyfieAuth", cookieOptions);

        return Ok(new { message = "Logged out successfully" });
    }


    // --- HELPER METHODS ---
    private string AppendAuthCookie(LyfieUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        var isHttps = Request.IsHttps;

        Response.Cookies.Append("LyfieAuth", tokenString, new CookieOptions
        {
            HttpOnly = true,
            // If accessed via http://x.x.x.x, Secure is false.
            // If accessed via https://www.domain.com, Secure is true.
            Secure = isHttps,
            SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return tokenString;
    }

    private AuthenticationLog CreateLog(string userId, string email, AuthenticationCategory category)
    {
        return new AuthenticationLog
        {
            UserId = userId,
            UserEmail = email,
            AuthenticationType = AuthenticationType.Password,
            AuthenticationCategory = category,
            LogTimestamp = DateTime.UtcNow
        };
    }
}