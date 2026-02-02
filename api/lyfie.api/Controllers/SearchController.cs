using lyfie.data;
using Microsoft.AspNetCore.Mvc;

namespace lyfie.api.Controllers
{
    [ApiController]
    [Route("api/search")]
    public class SearchController : ControllerBase
    {
        private readonly LyfieDbContext _context;
        public SearchController(LyfieDbContext context)
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
