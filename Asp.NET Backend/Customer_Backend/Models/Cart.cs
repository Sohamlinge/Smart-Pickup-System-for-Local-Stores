using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SmartPickupAPI.Models; // For User
using CustomerApp.Models;    // For ProductShopkeeper

namespace CustomerApp.Models
{
    [Table("cart")]
    public class Cart
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("cartid")]
        public int CartId { get; set; }

        [Required]
        [Column("uid")] // FK → users.uid
        public int Uid { get; set; }

        [Required]
        [Column("spid")] // FK → product_shopkeeper.spid
        public int Spid { get; set; }

        [Required]
        [Column("qty")]
        public int Quantity { get; set; }

        // Navigation property for User
        [ForeignKey(nameof(Uid))]
        public virtual User User { get; set; }

        // Navigation property for ProductShopkeeper
        [ForeignKey(nameof(Spid))]
        public virtual ProductShopkeeper ProductShopkeeper { get; set; }
    }
}
