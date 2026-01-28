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
        Console.WriteLine($"Running in Docker: {Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER")}");

        var builder = WebApplication.CreateBuilder(args);

        // 0. CORS Policy (Crucial for React + Cookies)
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("LyfieCorsPolicy", policy =>
            {
                policy.WithOrigins(
                    "http://localhost:5173", 
                    "http://127.0.0.1:5173",
                    "http://10.10.10.10:8080")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials(); // Required for HttpOnly Cookies
            });
        });

        // 1. Custom Cookie Authentication 
        builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options => {
                options.Cookie.Name = "LyfieAuth";
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

        // If we're in Docker, append the "No Locking" flags automatically
        if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true")
        {
            connectionString = "Data Source=/app/data/lyfie.db;Mode=ReadWriteCreate;";
        }

        builder.Services.AddDbContext<LyfieDbContext>(options =>
            options.UseSqlite(connectionString));

        // 3. Dependency Injection for Custom Services
        builder.Services.AddScoped<IPasswordService, PasswordService>();
        builder.Services.AddAuthorization();

        // 4. Data Protection (Persisting keys for session stability)
        builder.Services.AddDataProtection()
            .PersistKeysToDbContext<LyfieDbContext>()
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

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<LyfieDbContext>();

            if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true")
            {
                // 1. Manually open the connection
                db.Database.OpenConnection();

                // 2. Disable the locking and journaling that causes 'Disk I/O Error' on Windows mounts
                using var command = db.Database.GetDbConnection().CreateCommand();
                command.CommandText = "PRAGMA journal_mode=OFF; PRAGMA locking_mode=NORMAL;";
                command.ExecuteNonQuery();
            }

            // 3. NOW run migrations—the I/O error should be gone because journaling is OFF
            db.Database.Migrate();
        }

        if (app.Environment.IsDevelopment())
        {
            app.UseHttpsRedirection(); // Only in Dev
        }

        // Order matters: Routing -> CORS -> Auth
        app.UseRouting();
        app.UseCors("LyfieCorsPolicy");
        app.UseDefaultFiles(); // 1. Looks for index.html
        app.UseStaticFiles();  // 2. Serves the React JS/CSS files

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers(); // Ex. AuthController.cs will handle /api/auth/login etc.

        app.MapFallbackToFile("index.html");

        app.Run();
    }
}