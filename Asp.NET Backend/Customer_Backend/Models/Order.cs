using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SmartPickupAPI.Models;

namespace CustomerApp.Models
{
    [Table("orders")]
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        [Required]
        public float TotalPrice { get; set; }

        [ForeignKey("User")]
        public int CustId { get; set; }
        public User? User { get; set; }  // Navigation property

        [ForeignKey("Shopkeeper")]
        public int sid { get; set; }
        public Shopkeeper? Shopkeeper { get; set; }  // Navigation property

        [Required]
        public DateTime? CustomerDatetime { get; set; }

        [Required]
        public DateTime? ShopkeeperDatetime { get; set; }  // Adjust type if needed

        [Required]
        public string OrderStatus { get; set; }

        public ICollection<OrderDetails> OrderDetails { get; set; }
    }
}
