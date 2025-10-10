using Admin_Login.Data;
using Admin_Login.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Admin_Login.Controllers
{
    [Route("/admin/[controller]")]
    [ApiController]
    public class SubCategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubCategoriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetSubCategories()
        {
            var subcategories = await _context.SubCategories
                .Include(sc => sc.Category)
                .Select(sc => new
                {
                    sc.SubCatId,
                    sc.SubCatName,
                    sc.CatId,
                    Category = sc.Category == null ? null : new
                    {
                        sc.Category.CatId,
                        sc.Category.CatName
                    }
                })
                .ToListAsync();

            return Ok(subcategories);
        }


        [HttpPost]
        public async Task<IActionResult> PostSubCategory(SubCategory subCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.SubCategories.Add(subCategory);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(subCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }





    }
}
