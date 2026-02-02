using lyfie.data;
using Microsoft.AspNetCore.Mvc;

namespace lyfie.api.Controllers
{
    [ApiController]
    [Route("api/keys")]
    public class APIController : ControllerBase
    {
        private readonly LyfieDbContext _context;
        
        public APIController(LyfieDbContext context)
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
