using System;
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
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrderController> _logger;

        public OrderController(AppDbContext context, ILogger<OrderController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("by-customer/{custId}")]
        public async Task<IActionResult> GetOrdersSummaryForCustomer(int custId)
        {
            if (custId <= 0)
                return BadRequest("Invalid customer id.");

            var orders = await _context.Orders
                .Where(o => o.CustId == custId)
                .Join(
                    _context.Shopkeepers,
                    order => order.sid,
                    shopkeeper => shopkeeper.sid,
                    (order, shopkeeper) => new
                    {
                        orderId = order.OrderId,
                        totalPrice = order.TotalPrice,
                        // Use nullable DateTime here to avoid casting null to DateTime
                        shopkeeperDatetime = order.ShopkeeperDatetime.HasValue ? order.ShopkeeperDatetime : (DateTime?)null,
                        orderStatus = order.OrderStatus,
                        sname = shopkeeper.sname,
                        sphoneNo = shopkeeper.sphoneno
                    }
                )
                .OrderByDescending(o => o.orderId)
                .ToListAsync();

            if (orders.Count == 0)
                return NotFound("No orders found for this customer.");

            return Ok(orders);
        }

        // POST: /customer/Order/place
        [HttpPost("place")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequest request)
        {
            if (request.CustId <= 0 || request.Items == null || !request.Items.Any())
                return BadRequest("Invalid order request data.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Fetch ProductShopkeepers from your database for the given spids
                var spids = request.Items.Select(i => i.Spid).ToList();
                var productShopkeepers = await _context.ProductShopkeepers
                    .Where(ps => spids.Contains(ps.Spid))
                    .ToListAsync();

                if (productShopkeepers.Count == 0)
                    return BadRequest("No valid products found in the order.");

                // Group items by shopkeeper id (sid)
                var groupedByShopkeeper = request.Items
                    .GroupBy(item => productShopkeepers.First(ps => ps.Spid == item.Spid).Sid);

                var createdOrderIds = new List<int>();

                foreach (var group in groupedByShopkeeper)
                {
                    int shopkeeperId = group.Key;

                    // Calculate total price for this shopkeeper group
                    float totalPrice = 0;
                    foreach (var item in group)
                    {
                        var ps = productShopkeepers.First(p => p.Spid == item.Spid);
                        totalPrice += ps.Price * item.Quantity;
                    }

                    // Create order instance
                    var order = new Order
                    {
                        CustId = request.CustId,
                        sid = shopkeeperId,
                        TotalPrice = totalPrice,
                        CustomerDatetime = DateTime.Now,
                        ShopkeeperDatetime = null,  // initially null, update later if needed
                        OrderStatus = "Pending",
                        OrderDetails = new List<OrderDetails>()
                    };

                    // Add order details for each item in this group
                    foreach (var item in group)
                    {
                        var ps = productShopkeepers.First(p => p.Spid == item.Spid);
                        var orderDetail = new OrderDetails
                        {
                            Spid = item.Spid,
                            Qty = item.Quantity,
                            Price = ps.Price
                        };
                        order.OrderDetails.Add(orderDetail);
                    }

                    await _context.Orders.AddAsync(order);
                    await _context.SaveChangesAsync(); // Save to get OrderId

                    createdOrderIds.Add(order.OrderId);
                }

                // Clear cart items for this customer
                var carts = _context.Carts.Where(c => c.Uid == request.CustId);
                _context.Carts.RemoveRange(carts);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Order placed successfully.", orderIds = createdOrderIds });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error placing order for customer {CustId}", request.CustId);
                return StatusCode(500, $"An error occurred while placing the order: {ex.Message}");
            }
        }
    }

    // Request DTOs
    public class PlaceOrderRequest
    {
        public int CustId { get; set; }         
        public List<OrderItem> Items { get; set; }
    }

    public class OrderItem
    {
        public int Spid { get; set; }
        public int Quantity { get; set; }
    }
}
