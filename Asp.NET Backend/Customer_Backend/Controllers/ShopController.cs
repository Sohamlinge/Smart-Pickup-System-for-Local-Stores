using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomerApp.Data;
using CustomerApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerApp.Controllers
{
    [ApiController]
    [Route("/customer/[controller]")]
    public class ShopController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShopController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /customer/shop/by-address/{address}
        [HttpGet("by-address/{address}")]
        public async Task<ActionResult<IEnumerable<Shopkeeper>>> GetShopsByAddress(string address)
        {
            if (string.IsNullOrWhiteSpace(address))
                return BadRequest("Address is required.");

            var shops = await _context.Shopkeepers
                .Where(s => EF.Functions.Like(s.SAddress.ToLower(), $"%{address.ToLower()}%"))
                .ToListAsync();

            if (shops == null || shops.Count == 0)
                return NotFound($"No shops found at address: {address}");

            return Ok(shops);
        }

        // GET: /customer/shop/products-by-shop/{sid}
        [HttpGet("products-by-shop/{sid}")]
        public async Task<IActionResult> GetCategoriesWithProductsByShop(int sid)
        {
            if (sid <= 0)
                return BadRequest("Invalid shop id");

            var categories = await _context.Categories
                .Include(c => c.SubCategories)
                    .ThenInclude(sc => sc.Products)
                        .ThenInclude(p => p.ProductShopkeepers)
                .ToListAsync();

            var result = categories.Select(cat => new
            {
                catId = cat.CatId,
                catName = cat.CatName,
                subCategories = cat.SubCategories.Select(sub => new
                {
                    subCatId = sub.SubCatId,
                    subCatName = sub.SubCatName,
                    products = sub.Products.Select(p =>
                    {
                        var ps = p.ProductShopkeepers.FirstOrDefault(x => x.Sid == sid);

                        return new
                        {
                            pid = p.Pid,
                            pname = p.Pname,
                            description = p.Description,
                            image = p.Image,
                            price = ps?.Price ?? (float?)null,
                            stock_status = ps?.StockStatus ?? "Unavailable",
                            spid = ps?.Spid
                        };
                    }).ToList()
                }).ToList()
            }).ToList();

            return Ok(result);
        }
    }
}
