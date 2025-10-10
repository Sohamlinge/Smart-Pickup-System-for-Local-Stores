using System;
using System.Linq;
using System.Threading.Tasks;
using Admin_Login.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("/admin/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Orders/daily
    [HttpGet("daily")]
    public async Task<IActionResult> GetDailyOrders()
    {
        try
        {
            if (_context.Orders == null)
                return NotFound("Orders table is missing or not initialized.");

            var rawData = await _context.Orders
                .GroupBy(o => o.Date.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(g => g.Date)
                .ToListAsync();

            var result = rawData.Select(d => new
            {
                date = d.Date.ToString("yyyy-MM-dd"),
                count = d.Count
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("Error in GetDailyOrders: " + ex);
            return StatusCode(500, new
            {
                message = "An error occurred while fetching daily orders.",
                error = ex.Message
            });
        }
    }
}
