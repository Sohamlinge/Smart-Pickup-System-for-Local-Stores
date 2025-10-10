using System.Linq;
using System.Threading.Tasks;
using CustomerApp.Controllers.CustomerApp.Models;
using CustomerApp.Data;
using CustomerApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerApp.Controllers
{
    [ApiController]
    [Route("/customer/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CartController> _logger;

        public CartController(AppDbContext context, ILogger<CartController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: /customer/Cart/add
        // Adds to cart using sid+pid -> spid
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequestWithSidPid request)
        {
            if (request.Uid <= 0 || request.Sid <= 0 || request.Pid <= 0 || request.Quantity <= 0)
                return BadRequest("Invalid input data.");

            try
            {
                _logger.LogInformation("AddToCart: Uid={Uid}, Sid={Sid}, Pid={Pid}, Qty={Qty}",
                    request.Uid, request.Sid, request.Pid, request.Quantity);

                // Map (Sid, Pid) -> Spid
                var ps = await _context.ProductShopkeepers
                    .FirstOrDefaultAsync(x => x.Sid == request.Sid && x.Pid == request.Pid);

                if (ps == null)
                {
                    _logger.LogWarning("No ProductShopkeeper found for Sid={Sid}, Pid={Pid}", request.Sid, request.Pid);
                    return NotFound($"Product with Pid {request.Pid} not found for Shopkeeper Sid {request.Sid}.");
                }

                int spid = ps.Spid;

                // Check if item already in cart
                var existingCart = await _context.Carts
                    .FirstOrDefaultAsync(c => c.Uid == request.Uid && c.Spid == spid);

                if (existingCart != null)
                {
                    existingCart.Quantity += request.Quantity;
                    _context.Carts.Update(existingCart);
                    _logger.LogInformation("Updated cart: Spid={Spid}, NewQty={Qty}", spid, existingCart.Quantity);
                }
                else
                {
                    var cartItem = new Cart
                    {
                        Uid = request.Uid,
                        Spid = spid,
                        Quantity = request.Quantity
                    };

                    await _context.Carts.AddAsync(cartItem);
                    _logger.LogInformation("Added new cart item: Spid={Spid}", spid);
                }

                var changes = await _context.SaveChangesAsync();

                if (changes > 0)
                    return Ok(new { message = "Added to cart successfully", spid });
                else
                    return StatusCode(500, "No changes saved to database. Possible DB issue.");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error adding to cart Uid={Uid} Sid={Sid} Pid={Pid}", request.Uid, request.Sid, request.Pid);
                return StatusCode(500, "An error occurred while adding to cart.");
            }
        }

        // New method: Add to cart by Uid, Spid directly
        [HttpPost("add/by-spid")]
        public async Task<IActionResult> AddToCartBySpid([FromBody] CustomerApp.Models.AddToCartRequestWithSpid request)
        {
            if (request.Uid <= 0 || request.Spid <= 0 || request.Quantity <= 0)
                return BadRequest("Invalid input data.");

            try
            {
                var existingCart = await _context.Carts
                    .FirstOrDefaultAsync(c => c.Uid == request.Uid && c.Spid == request.Spid);

                if (existingCart != null)
                {
                    existingCart.Quantity += request.Quantity;
                    _context.Carts.Update(existingCart);
                }
                else
                {
                    var cartItem = new Cart
                    {
                        Uid = request.Uid,
                        Spid = request.Spid,
                        Quantity = request.Quantity
                    };
                    await _context.Carts.AddAsync(cartItem);
                }

                var changes = await _context.SaveChangesAsync();

                if (changes > 0)
                    return Ok(new { message = "Added to cart successfully", spid = request.Spid });
                else
                    return StatusCode(500, "No changes saved to database.");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error adding to cart Uid={Uid} Spid={Spid}", request.Uid, request.Spid);
                return StatusCode(500, "An error occurred while adding to cart.");
            }
        }


        [HttpGet("user/{Uid}")]
        public async Task<IActionResult> GetCartItems(int Uid)
        {
            if (Uid <= 0)
                return BadRequest("Invalid customer ID.");

            try
            {
                var cartItems = await (from c in _context.Carts
                                       join ps in _context.ProductShopkeepers on c.Spid equals ps.Spid
                                       join p in _context.Products on ps.Pid equals p.Pid
                                       where c.Uid == Uid
                                       select new
                                       {
                                           CartId = c.CartId,          // your cart PK field
                                           Uid = c.Uid,
                                           Spid = c.Spid,
                                           Quantity = c.Quantity,
                                           ProductName = p.Pname,
                                           ProductDescription = p.Description,
                                           ProductImage = p.Image,
                                           Price = ps.Price,
                                           StockStatus = ps.StockStatus
                                       }).ToListAsync();

                return Ok(cartItems);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cart items for customer {Uid}", Uid);
                return StatusCode(500, "An error occurred while retrieving cart items.");
            }
        }

        // POST: /customer/Cart/reduce
        // Reduce quantity of an item in the cart by Uid + Spid
        [HttpPost("reduce")]
        public async Task<IActionResult> ReduceCartQuantity([FromBody] CustomerApp.Models.AddToCartRequestWithSpid request)
        {
            if (request.Uid <= 0 || request.Spid <= 0 || request.Quantity <= 0)
                return BadRequest("Invalid input data.");

            try
            {
                var existingCart = await _context.Carts
                    .FirstOrDefaultAsync(c => c.Uid == request.Uid && c.Spid == request.Spid);

                if (existingCart == null)
                    return NotFound("Cart item not found.");

                // Reduce quantity
                existingCart.Quantity -= request.Quantity;

                if (existingCart.Quantity > 0)
                {
                    _context.Carts.Update(existingCart);
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Reduced quantity successfully", spid = request.Spid, newQuantity = existingCart.Quantity });
                }
                else
                {
                    // Quantity zero or less: remove the item from cart
                    _context.Carts.Remove(existingCart);
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Cart item removed as quantity became zero or less", spid = request.Spid });
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error reducing cart quantity for Uid={Uid}, Spid={Spid}", request.Uid, request.Spid);
                return StatusCode(500, "An error occurred while reducing the cart quantity.");
            }
        }





        // DELETE: /customer/Cart/remove/{cartId}
        [HttpDelete("remove/{cartId}")]
        public async Task<IActionResult> RemoveCartItem(int cartId)
        {
            if (cartId <= 0)
                return BadRequest("Invalid cart ID.");

            try
            {
                var cartItem = await _context.Carts.FindAsync(cartId);
                if (cartItem == null)
                    return NotFound("Cart item not found.");

                _context.Carts.Remove(cartItem);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Removed cart item." });
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error removing cart item {CartId}", cartId);
                return StatusCode(500, "An error occurred while removing the cart item.");
            }
        }

        // POST: /customer/Cart/clear/{Uid}
        [HttpPost("clear/{Uid}")]
        public async Task<IActionResult> ClearCart(int Uid)
        {
            if (Uid <= 0)
                return BadRequest("Invalid customer ID.");

            try
            {
                var items = _context.Carts.Where(c => c.Uid == Uid);
                _context.Carts.RemoveRange(items);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cart cleared successfully." });
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart for customer {Uid}", Uid);
                return StatusCode(500, "An error occurred while clearing the cart.");
            }
        }
    }

    namespace CustomerApp.Models
    {
        public class AddToCartRequestWithSidPid
        {
            public int Uid { get; set; }    // maps to User.Uid
            public int Sid { get; set; }    // shopkeeper id
            public int Pid { get; set; }    // product id
            public int Quantity { get; set; } // qty to add
        }

        public class AddToCartRequestWithSpid
        {
            public int Uid { get; set; }
            public int Spid { get; set; }
            public int Quantity { get; set; }
        }
    }
}
