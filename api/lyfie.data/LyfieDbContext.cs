using Microsoft.EntityFrameworkCore;
using lyfie.core.Entities;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;

namespace lyfie.data;

// IdentityDbContext<IdentityUser> automatically creates tables for 
// Users, Roles, and Claims.
public class LyfieDbContext : DbContext, IDataProtectionKeyContext
{
    public LyfieDbContext(DbContextOptions<LyfieDbContext> options) : base(options) { }
    public DbSet<LyfieUser> Users { get; set; }

    public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }
}