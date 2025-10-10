using CustomerApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerApp.Controllers
{
    [Route("/customer/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult> GetSimplifiedProducts()
        {
            var products = await _context.Products
                .Include(p => p.SubCategory)
                    .ThenInclude(sc => sc.Category)
                .Include(p => p.ProductShopkeepers)
                    .ThenInclude(ps => ps.Shopkeeper)
                .Select(p => new
                {
                    pid = p.Pid,
                    pname = p.Pname,
                    description = p.Description,
                    image = p.Image,
                    subCategory = p.SubCategory.SubCatName,       // ✅ from SubCategory.cs
                    category = p.SubCategory.Category.CatName,    // ✅ from Category.cs
                    shopkeepers = p.ProductShopkeepers.Select(ps => new
                    {
                        sname = ps.Shopkeeper.sname,              // ✅ from Shopkeeper.cs
                        location = ps.Shopkeeper.SAddress,        // ✅ from Shopkeeper.cs
                        price = ps.Price,
                        stockStatus = ps.StockStatus
                    })
                })
                .ToListAsync();

            return Ok(products);
        }


        // Optional: Get by product ID in simplified format
        [HttpGet("{id}")]
        public async Task<ActionResult> GetSimplifiedProductById(int id)
        {
            var product = await _context.Products
                .Where(p => p.Pid == id)
                .Include(p => p.SubCategory)
                    .ThenInclude(sc => sc.Category)
                .Include(p => p.ProductShopkeepers)
                    .ThenInclude(ps => ps.Shopkeeper)
                .Select(p => new
                {
                    pid = p.Pid,
                    pname = p.Pname,
                    description = p.Description,
                    image = p.Image,
                    subCategory = p.SubCategory.SubCatName,
                    category = p.SubCategory.Category.CatName,
                    shopkeepers = p.ProductShopkeepers.Select(ps => new
                    {
                        sname = ps.Shopkeeper.sname,
                        location = ps.Shopkeeper.SAddress,
                        price = ps.Price,
                        stockStatus = ps.StockStatus
                    })
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound("Product not found.");

            return Ok(product);
        }
    }
}
