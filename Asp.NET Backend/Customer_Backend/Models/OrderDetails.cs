using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CustomerApp.Models
{
    [Table("orderdetails")]
    public class OrderDetails
    {
        [Key]
        public int OrderDetailsId { get; set; }

        [ForeignKey("Order")]
        public int OrderId { get; set; }

        [JsonIgnore]
        public Order Order { get; set; }  // Navigation property

        [ForeignKey("ProductShopkeeper")]
        public int Spid { get; set; }

        [JsonIgnore]
        public ProductShopkeeper ProductShopkeeper { get; set; }  // Navigation property

        [Required]
        public int Qty { get; set; }

        [Required]
        public float Price { get; set; }
    }
}
