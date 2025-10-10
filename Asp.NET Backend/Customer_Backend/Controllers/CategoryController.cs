using CustomerApp.Data;
using CustomerApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerApp.Controllers
{
    [Route("/customer/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Include(c => c.SubCategories)
                    .ThenInclude(sc => sc.Products)
                        .ThenInclude(p => p.ProductShopkeepers)
                            .ThenInclude(ps => ps.Shopkeeper)
                .Select(c => new
                {
                    c.CatId,
                    c.CatName,
                    SubCategories = c.SubCategories.Select(sc => new
                    {
                        sc.SubCatId,
                        sc.SubCatName,
                        Products = sc.Products.Select(p => new
                        {
                            p.Pid,
                            p.Pname,
                            Shopkeepers = p.ProductShopkeepers.Select(ps => new
                            {
                                ps.Sid,
                                ps.Price,
                                ps.StockStatus,
                                ShopName = ps.Shopkeeper.sname
                            })
                        })
                    })
                })
                .ToListAsync();

            return Ok(categories);
        }


        [HttpGet("{id}/products")]
        public async Task<ActionResult> GetProductsByCategory(int id)
        {
            var subCatIds = await _context.SubCategories
                .Where(sc => sc.CatId == id)
                .Select(sc => sc.SubCatId)
                .ToListAsync();

            var products = await _context.Products
                .Where(p => subCatIds.Contains(p.SubCatId))
                .Include(p => p.ProductShopkeepers)
                    .ThenInclude(ps => ps.Shopkeeper)
                .Select(p => new
                {
                    p.Pid,
                    p.Pname,
                    Shopkeepers = p.ProductShopkeepers.Select(ps => new
                    {
                        ps.Sid,
                        ps.Price,
                        ps.StockStatus,
                        ShopName = ps.Shopkeeper.sname
                    })
                })
                .ToListAsync();

            if (products == null || !products.Any())
            {
                return NotFound("No products found for this category.");
            }

            return Ok(products);
        }
    }
}
