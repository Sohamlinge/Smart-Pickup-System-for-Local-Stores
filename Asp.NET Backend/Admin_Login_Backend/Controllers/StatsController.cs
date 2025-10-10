using Admin_Login.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Admin_Login.Controllers
{
    [Route("/admin/[controller]")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Stats/counts
        [HttpGet("counts")]
        public async Task<IActionResult> GetCounts()
        {
            try
            {
                // Await each query sequentially on the same DbContext instance
                var usersCount = await _context.Users.CountAsync();
                var shopkeepersCount = await _context.Shopkeepers.CountAsync();
                var ordersCount = await _context.Orders.CountAsync();

                return Ok(new
                {
                    Users = usersCount,
                    Shopkeepers = shopkeepersCount,
                    Orders = ordersCount
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("Error in GetCounts: " + ex);
                return StatusCode(500, new
                {
                    message = "Something went wrong while fetching counts.",
                    error = ex.Message
                });
            }
        }
    }
}
