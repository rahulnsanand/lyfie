using lyfie.data;
using Microsoft.AspNetCore.Mvc;

namespace lyfie.api.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly LyfieDbContext _context;
        public UserController(LyfieDbContext context)
        {
            _context = context;
        }

        [HttpPut("change-pin")]
        public async Task<IActionResult> ChangePin()
        {
            return Ok();
        }
    }
}
