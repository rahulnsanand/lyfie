namespace lyfie.core.Entities;

public abstract class BaseEntity
{
    public int Id { get; set; }

    // The "Single-Origin" Family Link
    // Every record belongs to a specific IdentityUser
    public required string UserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}