using lyfie.data;
using Microsoft.AspNetCore.Mvc;

namespace lyfie.api.Controllers
{
    [ApiController]
    [Route("api/trash")]
    public class TrashController : ControllerBase
    {
        private readonly LyfieDbContext _context;
        public TrashController(LyfieDbContext context)
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
