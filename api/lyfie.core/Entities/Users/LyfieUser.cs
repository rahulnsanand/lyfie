using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace lyfie.core.Entities.Users
{
    [Table("lyfie_user")]
    public class LyfieUser
    {
        [Key]
        [Required]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsTwoFactored { get; set; } = false;
    }
}
