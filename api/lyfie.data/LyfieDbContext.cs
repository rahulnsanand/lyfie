using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using lyfie.core.Entities.Users;
using lyfie.core.Entities.Auth;

namespace lyfie.data;

public class LyfieDbContext : DbContext, IDataProtectionKeyContext
{
    public LyfieDbContext(DbContextOptions<LyfieDbContext> options) : base(options) { }
    public DbSet<LyfieUser> Users { get; set; }
    public DbSet<AuthenticationLog> AuthenticationLogs { get; set; }
    public DbSet<DataProtectionKey> DataProtectionKeys { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Explicitly tell PostgreSQL to treat Id as an Identity column
        modelBuilder.Entity<DataProtectionKey>(entity =>
        {
            entity.Property(e => e.Id).UseIdentityByDefaultColumn();
        });
    }
}