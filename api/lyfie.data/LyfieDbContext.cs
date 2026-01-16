using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace lyfie.data;

// IdentityDbContext<IdentityUser> automatically creates tables for 
// Users, Roles, and Claims.
public class LyfieDbContext : IdentityDbContext
{
    public LyfieDbContext(DbContextOptions<LyfieDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // This is where you'll later configure Global Query Filters 
        // to ensure User A never sees User B's data.
    }
}