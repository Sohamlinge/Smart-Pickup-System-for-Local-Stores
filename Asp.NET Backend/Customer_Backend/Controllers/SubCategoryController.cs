using CustomerApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerApp.Controllers
{
    [Route("/customer/[controller]")]
    [ApiController]
    public class SubCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubCategoryController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/SubCategory/by-category/3
        [HttpGet("by-category/{catId}")]
        public async Task<ActionResult> GetSubCategoriesByCategory(int catId)
        {
            var subCategories = await _context.SubCategories
                .Where(s => s.CatId == catId)
                .Include(s => s.Products)
                    .ThenInclude(p => p.ProductShopkeepers)
                .Select(s => new
                {
                    subCatId = s.SubCatId,
                    subCatName = s.SubCatName,
                    products = s.Products.Select(p => new
                    {
                        pid = p.Pid,
                        pname = p.Pname,
                        description = p.Description,
                        image = p.Image,
                        productShopkeepers = p.ProductShopkeepers.Select(ps => new
                        {
                            sid = ps.Sid,
                            price = ps.Price,
                            stock_status = ps.StockStatus
                        })
                    })
                })
                .ToListAsync();

            return Ok(subCategories);
        }



        // ✅ GET: api/SubCategory/5/products
        [HttpGet("{id}/products")]
        public async Task<ActionResult> GetProductsBySubCategory(int id)
        {
            var products = await _context.Products
                .Where(p => p.SubCatId == id)
                .Include(p => p.ProductShopkeepers)
                .Select(p => new
                {
                    pid = p.Pid,
                    pname = p.Pname,
                    description = p.Description,
                    image = p.Image,
                    productShopkeepers = p.ProductShopkeepers.Select(ps => new
                    {
                        sid = ps.Sid,
                        price = ps.Price,
                        stock_status = ps.StockStatus
                    })
                })
                .ToListAsync();

            return Ok(products);
        }
    }
}
