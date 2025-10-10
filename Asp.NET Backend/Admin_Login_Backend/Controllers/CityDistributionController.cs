using System.Linq;
using System.Threading.Tasks;
using Admin_Login.Data;
using Admin_Login.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Admin.Controllers
{
    [Route("/admin/stats")]
    [ApiController]
    public class CityDistributionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CityDistributionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("city-distribution")]
        public async Task<IActionResult> GetCityDistribution()
        {
            var userData = await _context.Users
                .Where(u => !string.IsNullOrWhiteSpace(u.Address))
                .GroupBy(u => u.Address.Trim().ToLower())
                .Select(g => new { City = g.Key, UserCount = g.Count() })
                .ToListAsync();

            var shopkeeperData = await _context.Shopkeepers
                .Where(s => !string.IsNullOrWhiteSpace(s.Saddress))
                .GroupBy(s => s.Saddress.Trim().ToLower())
                .Select(g => new { City = g.Key, ShopkeeperCount = g.Count() })
                .ToListAsync();

            var allCities = userData.Select(u => u.City)
                .Union(shopkeeperData.Select(s => s.City))
                .Distinct()
                .OrderBy(city => city);

            var result = allCities.Select(city => new
            {
                City = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(city),
                UserCount = userData.FirstOrDefault(u => u.City == city)?.UserCount ?? 0,
                ShopkeeperCount = shopkeeperData.FirstOrDefault(s => s.City == city)?.ShopkeeperCount ?? 0
            }).ToList();

            return Ok(result);
        }
    }
}
