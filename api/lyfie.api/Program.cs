using lyfie.core.Interfaces;
using lyfie.core.Services;
using lyfie.data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Security.Cryptography;
using System.Text;
    
public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // --- 1. THE SELF-GENERATING KEY LOGIC ---
        // This ensures a key is created on the first run and persists in the DB via DataProtection
        // Or we can generate a consistent one from a specific seed.
        var jwtKeyPath = Path.Combine(AppContext.BaseDirectory, "jwt.key");
        if (!File.Exists(jwtKeyPath))
        {
            var keyBytes = new byte[32];
            RandomNumberGenerator.Fill(keyBytes);
            File.WriteAllText(jwtKeyPath, Convert.ToBase64String(keyBytes));
        }
        var secretKey = File.ReadAllText(jwtKeyPath);
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        // --- 2. UPDATED AUTHENTICATION (JWT + COOKIE HYBRID) ---
        builder.Services.AddAuthentication(options => {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options => {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false, // Simplified for zero-config
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context => {
                    // 1. Try to get token from the standard Authorization header (Bearer)
                    string authHeader = context.Request.Headers["Authorization"];
                    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                    {
                        context.Token = authHeader.Substring("Bearer ".Length).Trim();
                    }

                    // 2. If no header, fallback to the cookie (for React/Browser)
                    if (string.IsNullOrEmpty(context.Token))
                    {
                        context.Token = context.Request.Cookies["LyfieAuth"];
                    }
                    return Task.CompletedTask;
                }
            };
        });

        // --- 3. CORS POLICY ---
        builder.Services.AddCors(options => {
            options.AddPolicy("LyfieCorsPolicy", policy => {
                policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials(); // REQUIRED for HttpOnly cookies
            });
        });

        // --- 4. DATABASE & DATA PROTECTION ---
        var connectionString = builder.Configuration.GetConnectionString("PGConnection");
        if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true")
        {
            connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? connectionString;
        }

        builder.Services.AddDbContext<LyfieDbContext>(options =>
            options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());

        builder.Services.AddDataProtection()
            .PersistKeysToDbContext<LyfieDbContext>()
            .SetApplicationName("LyfieApp");

        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            // Only add this if you know your internal network is secure
            options.KnownIPNetworks.Clear();
            options.KnownProxies.Clear();
        });

        // --- 5. SERVICES ---
        builder.Services.AddScoped<IPasswordService, PasswordService>();
        // Add a singleton for Key so Controller can use it to generate the token
        builder.Services.AddSingleton(signingKey);

        builder.Services.AddAuthorization();
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Lyfie API", Version = "v1" });

            const string schemeId = "Bearer";

            // 1. Define the Security Scheme
            c.AddSecurityDefinition(schemeId, new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and your token.",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http, // Use 'Http' for modern Bearer schemes
                Scheme = "bearer",             // lowercase 'bearer' is standard for RFC 7235
                BearerFormat = "JWT"
            });

            // 2. Correct Delegate Pattern for .NET 10
            c.AddSecurityRequirement(document =>
            {
                var requirement = new OpenApiSecurityRequirement();

                // Use the new OpenApiSecuritySchemeReference class
                var schemeReference = new OpenApiSecuritySchemeReference(schemeId, document);

                requirement.Add(schemeReference, new List<string>());

                return requirement;
            });
        });

        var app = builder.Build();
        app.UseForwardedHeaders();

        // --- 6. MIGRATIONS & MIDDLEWARE ---
        using (var scope = app.Services.CreateScope())
        {
            scope.ServiceProvider.GetRequiredService<LyfieDbContext>().Database.Migrate();
        }

        app.UseDefaultFiles(); // Looks for index.html
        app.UseStaticFiles();  // Serves the JS/CSS from wwwroot
        app.UseRouting();
        app.UseCors("LyfieCorsPolicy");
        app.UseAuthentication();
        app.UseAuthorization();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                // Explicitly set the endpoint
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Lyfie API V1");
            });
        }

        app.MapControllers();
        app.MapFallbackToFile("index.html");

        app.Run();
    }
}