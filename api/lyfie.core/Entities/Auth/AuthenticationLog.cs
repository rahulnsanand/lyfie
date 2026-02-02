using lyfie.core.Enums.Authentication;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace lyfie.core.Entities.Auth
{
    [Table("authentication_log")]
    public class AuthenticationLog
    {
        [Key]
        [Required]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public DateTime LogTimestamp { get; set; } = DateTime.UtcNow;
        public AuthenticationType AuthenticationType { get; set; } = AuthenticationType.Password;
        public AuthenticationCategory AuthenticationCategory { get; set; } = AuthenticationCategory.Default;
    }
}
