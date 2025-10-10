using System.Collections.Generic;
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
    public class ProductShopkeeperController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductShopkeeperController> _logger;

        public ProductShopkeeperController(AppDbContext context, ILogger<ProductShopkeeperController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: /customer/productshopkeeper
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.ProductShopkeepers
                .Include(ps => ps.Product)
                .Include(ps => ps.Shopkeeper)
                .ToListAsync();

            var result = list.Select(ps => new
            {
                spid = ps.Spid,
                sid = ps.Sid,
                shopkeeperName = ps.Shopkeeper?.sname,
                pid = ps.Pid,
                productName = ps.Product?.Pname,
                price = ps.Price,
                stockStatus = ps.StockStatus
            });

            return Ok(result);
        }

        // GET: /customer/productshopkeeper/{spid}
        [HttpGet("{spid}")]
        public async Task<IActionResult> GetById(int spid)
        {
            var ps = await _context.ProductShopkeepers
                .Include(psk => psk.Product)
                .Include(psk => psk.Shopkeeper)
                .FirstOrDefaultAsync(psk => psk.Spid == spid);

            if (ps == null)
                return NotFound($"ProductShopkeeper with spid {spid} not found.");

            return Ok(new
            {
                spid = ps.Spid,
                sid = ps.Sid,
                shopkeeperName = ps.Shopkeeper?.sname,
                pid = ps.Pid,
                productName = ps.Product?.Pname,
                price = ps.Price,
                stockStatus = ps.StockStatus
            });
        }

        // GET: /customer/productshopkeeper/by-shop/{sid}
        [HttpGet("by-shop/{sid}")]
        public async Task<IActionResult> GetByShopkeeper(int sid)
        {
            if (sid <= 0)
                return BadRequest("Invalid shopkeeper id.");

            var list = await _context.ProductShopkeepers
                .Where(ps => ps.Sid == sid)
                .Include(ps => ps.Product)
                .Include(ps => ps.Shopkeeper)
                .ToListAsync();

            var result = list.Select(ps => new
            {
                spid = ps.Spid,
                sid = ps.Sid,
                shopkeeperName = ps.Shopkeeper?.sname,
                pid = ps.Pid,
                productName = ps.Product?.Pname,
                price = ps.Price,
                stockStatus = ps.StockStatus
            });

            return Ok(result);
        }

        // GET: /customer/productshopkeeper/by-product/{pid}
        [HttpGet("by-product/{pid}")]
        public async Task<IActionResult> GetByProduct(int pid)
        {
            if (pid <= 0)
                return BadRequest("Invalid product id.");

            var list = await _context.ProductShopkeepers
                .Where(ps => ps.Pid == pid)
                .Include(ps => ps.Product)
                .Include(ps => ps.Shopkeeper)
                .ToListAsync();

            var result = list.Select(ps => new
            {
                spid = ps.Spid,
                sid = ps.Sid,
                shopkeeperName = ps.Shopkeeper?.sname,
                pid = ps.Pid,
                productName = ps.Product?.Pname,
                price = ps.Price,
                stockStatus = ps.StockStatus
            });

            return Ok(result);
        }

        // ✅ NEW: GET: /customer/productshopkeeper/by-shop-product?sid=51&pid=6
        [HttpGet("by-shop-product")]
        public async Task<IActionResult> GetByShopAndProduct([FromQuery] int sid, [FromQuery] int pid)
        {
            if (sid <= 0 || pid <= 0)
                return BadRequest("Invalid shopkeeper or product id.");

            var ps = await _context.ProductShopkeepers
                .FirstOrDefaultAsync(x => x.Sid == sid && x.Pid == pid);

            if (ps == null)
                return NotFound($"No ProductShopkeeper found for sid={sid} and pid={pid}");

            return Ok(new
            {
                spid = ps.Spid,
                sid = ps.Sid,
                pid = ps.Pid
            });
        }
    }
}
