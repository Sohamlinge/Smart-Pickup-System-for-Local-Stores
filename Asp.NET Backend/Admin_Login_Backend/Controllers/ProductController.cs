using Admin_Login.Data;
using Admin_Login.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Admin_Login.Controllers
{
    [Route("/admin/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.SubCategory)
                .ThenInclude(sc => sc.Category)
                .ToListAsync();

            return Ok(products);
        }

        // POST: api/Products
        // Add product without special image upload (optional endpoint)
        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.Pid }, product);
        }

        // POST: api/Products/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadProduct(
            [FromForm] string pname,
            [FromForm] string description,
            [FromForm] int subCatId,
            [FromForm] string imageFileName) // filename only, e.g., "image.jpg"
        {
            if (string.IsNullOrWhiteSpace(imageFileName))
                return BadRequest("Image filename is required.");

            var product = new Product
            {
                Pname = pname,
                Description = description,
                Image = $"/images/{imageFileName}",  // ✅ Store full path in DB
                SubCatId = subCatId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var response = new
            {
                product.Pid,
                product.Pname,
                product.Description,
                ImageUrl = product.Image,  // already has "/images/" prefix
                product.SubCatId
            };

            return Ok(response);
        }


        // DELETE: api/Products/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
