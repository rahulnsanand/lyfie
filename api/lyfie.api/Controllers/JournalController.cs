using lyfie.core.Interfaces;
using lyfie.data;
using Microsoft.AspNetCore.Mvc;

namespace lyfie.api.Controllers
{
    [ApiController]
    [Route("api/journal")]
    public class JournalController : ControllerBase
    {
        private readonly LyfieDbContext _context;
        private readonly IPasswordService _passwordService;

        public JournalController(LyfieDbContext context, IPasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }
    }
}
