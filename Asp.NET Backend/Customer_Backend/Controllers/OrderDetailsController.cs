using System.Linq;
using System.Threading.Tasks;
using CustomerApp.Data;
using CustomerApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerApp.Controllers
{
    [ApiController]
    [Route("/customer/[controller]")]
    public class OrderDetailsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrderDetailsController> _logger;

        public OrderDetailsController(AppDbContext context, ILogger<OrderDetailsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: /customer/OrderDetails/test
        // A simple endpoint to verify DB connection and fetching all OrderDetails
        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            try
            {
                var list = await _context.OrderDetails.ToListAsync();
                return Ok(list);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error fetching all order details");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("by-order/{orderId}")]
        public async Task<IActionResult> GetOrderDetailsByOrder(int orderId)
        {
            if (orderId <= 0)
                return BadRequest("Invalid order ID.");

            try
            {
                var details = await _context.OrderDetails
                    .Where(od => od.OrderId == orderId)
                    .Select(od => new
                    {
                        od.OrderDetailsId,
                        od.OrderId,
                        od.Spid,
                        od.Qty,
                        od.Price
                    })
                    .ToListAsync();

                if (details == null || details.Count == 0)
                    return NotFound("No order details found for this order.");

                return Ok(details);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error fetching order details for order {OrderId}", orderId);
                return StatusCode(500, "An error occurred while fetching order details.");
            }
        }

    }
}
