using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Admin_Login.Models;
using Admin_Login.Data;  // Updated to your actual namespace

namespace Admin_Login.Controllers
{
    [Route("/admin/[controller]")]
    [ApiController]
    public class ShopkeepersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShopkeepersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Shopkeepers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shopkeeper>>> GetShopkeepers()
        {
            return await _context.Shopkeepers.ToListAsync();
        }

        // GET: api/Shopkeepers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Shopkeeper>> GetShopkeeper(int id)
        {
            var shopkeeper = await _context.Shopkeepers.FindAsync(id);

            if (shopkeeper == null)
            {
                return NotFound();
            }

            return shopkeeper;
        }

        // POST: api/Shopkeepers
        [HttpPost]
        public async Task<ActionResult<Shopkeeper>> PostShopkeeper(Shopkeeper shopkeeper)
        {
            _context.Shopkeepers.Add(shopkeeper);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShopkeeper), new { id = shopkeeper.Sid }, shopkeeper);
        }

        // PUT: api/Shopkeepers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShopkeeper(int id, Shopkeeper shopkeeper)
        {
            if (id != shopkeeper.Sid)
            {
                return BadRequest("Shopkeeper ID mismatch");
            }

            _context.Entry(shopkeeper).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Shopkeepers.Any(e => e.Sid == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Shopkeepers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShopkeeper(int id)
        {
            var shopkeeper = await _context.Shopkeepers.FindAsync(id);
            if (shopkeeper == null)
            {
                return NotFound();
            }

            _context.Shopkeepers.Remove(shopkeeper);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
