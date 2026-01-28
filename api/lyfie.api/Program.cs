using lyfie.data;
using lyfie.core;
using lyfie.api;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // 0. Define the policy
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("LyfieCorsPolicy", policy =>
            {
                policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173") // Vite default ports
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        // 1. Add Database Context
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<LyfieDbContext>(options =>
            options.UseSqlite(connectionString));

        // 2. Enable Identity Core Services
        builder.Services.AddAuthorization();
        builder.Services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<LyfieDbContext>();

        // Add this block to persist keys across container restarts
        var keysFolder = Path.Combine(builder.Environment.ContentRootPath, "data/keys");
        if (!Directory.Exists(keysFolder)) Directory.CreateDirectory(keysFolder);

        builder.Services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo(keysFolder))
            .SetApplicationName("LyfieApp");

        // 3. (Optional) Swagger Support for Testing
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddControllers();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<LyfieDbContext>();
            db.Database.Migrate();
        }

        // Routing first
        app.UseRouting();
        app.UseCors("LyfieCorsPolicy");

        app.UseHttpsRedirection();
        
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        // 4. Map the Identity Routes (/register, /login, etc.)
        // Map the Identity Routes and group them in Swagger
        app.MapGroup("/auth")
           .MapIdentityApi<IdentityUser>()
           .WithTags("Authentication");
        // Add a manual logout endpoint since MapIdentityApi doesn't provide one
        app.MapPost("/auth/logout", async (SignInManager<IdentityUser> signInManager) =>
        {
            await signInManager.SignOutAsync();
            return Results.Ok();
        }).WithTags("Authentication");

        app.Run();
    }
}