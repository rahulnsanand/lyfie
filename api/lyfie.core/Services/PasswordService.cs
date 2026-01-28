using Konscious.Security.Cryptography;
using lyfie.core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace lyfie.core.Services
{
    public class PasswordService : IPasswordService
    {
        public string HashPassword(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(16);
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = salt,
                DegreeOfParallelism = 8, // Four cores
                Iterations = 4,
                MemorySize = 1024 * 64 // 64 MB
            };
            var hash = argon2.GetBytes(32);

            // Combine salt and hash for storage: "$salt.hash"
            return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }

        public bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split('.');
            var salt = Convert.FromBase64String(parts[0]);
            var hash = Convert.FromBase64String(parts[1]);

            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = salt,
                DegreeOfParallelism = 8,
                Iterations = 4,
                MemorySize = 1024 * 64
            };
            var newHash = argon2.GetBytes(32);
            return CryptographicOperations.FixedTimeEquals(hash, newHash);
        }
    }
}
