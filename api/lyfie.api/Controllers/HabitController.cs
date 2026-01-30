using lyfie.core.Interfaces;
using lyfie.data;
using Microsoft.AspNetCore.Mvc;

namespace lyfie.api.Controllers
{
    [ApiController]
    [Route("api/habit")]
    public class HabitController : ControllerBase
    {
        private readonly LyfieDbContext _context;
        private readonly IPasswordService _passwordService;

        public HabitController(LyfieDbContext context, IPasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        [HttpPut("change-pin")]
        public async Task<IActionResult> ChangePin()
        {
            return Ok();
        }
    }
}
