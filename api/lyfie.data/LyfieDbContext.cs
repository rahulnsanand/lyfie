using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using lyfie.core.Entities;

namespace lyfie.data;

// IdentityDbContext<IdentityUser> automatically creates tables for 
// Users, Roles, and Claims.
public class LyfieDbContext : IdentityDbContext
{
    public LyfieDbContext(DbContextOptions<LyfieDbContext> options) : base(options) { }
    public DbSet<LyfieUser> Users { get; set; }
}