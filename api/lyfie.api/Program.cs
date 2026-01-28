using lyfie.data;
using lyfie.core.Interfaces;
using lyfie.core.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // 0. CORS Policy (Crucial for React + Cookies)
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("LyfieCorsPolicy", policy =>
            {
                policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials(); // Required for HttpOnly Cookies
            });
        });

        // 1. Custom Cookie Authentication 
        builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options => {
                options.Cookie.Name = "LyfieSession";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.ExpireTimeSpan = TimeSpan.FromDays(7);
                options.SlidingExpiration = true;

                // Return 401 instead of redirecting to a login page
                options.Events.OnRedirectToLogin = context => {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

        // 2. Database Context 
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<LyfieDbContext>(options =>
            options.UseSqlite(connectionString));

        // 3. Dependency Injection for Custom Services
        builder.Services.AddScoped<IPasswordService, PasswordService>();
        builder.Services.AddAuthorization();

        // 4. Data Protection (Persisting keys for session stability)
        var keysFolder = Path.Combine(builder.Environment.ContentRootPath, "data/keys");
        if (!Directory.Exists(keysFolder)) Directory.CreateDirectory(keysFolder);

        builder.Services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo(keysFolder))
            .SetApplicationName("LyfieApp");

        // 5. API Controllers & Swagger
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // 6. Middleware Pipeline
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();

            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<LyfieDbContext>();
            db.Database.Migrate();
        }

        app.UseHttpsRedirection();

        // Order matters: Routing -> CORS -> Auth
        app.UseRouting();
        app.UseCors("LyfieCorsPolicy");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers(); // Ex. AuthController.cs will handle /api/auth/login etc.

        app.Run();
    }
}