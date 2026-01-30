using Microsoft.EntityFrameworkCore;
using lyfie.core.Entities;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

namespace lyfie.data;

public class LyfieDbContext : DbContext, IDataProtectionKeyContext
{
    public LyfieDbContext(DbContextOptions<LyfieDbContext> options) : base(options) { }
    public DbSet<LyfieUser> Users { get; set; }

    public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }

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