using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Admin_Login.Models
{
    [Table("product_shopkeeper")]
    public class ProductShopkeeper
    {
        [Key]
        [Column("spid")]
        public int Spid { get; set; } // Primary Key

        [Column("pid")]
        public int Pid { get; set; }  // Foreign Key to Product

        [Column("sid")]
        public int Sid { get; set; }  // Possibly Shopkeeper ID or Store ID

        [Column("price")]
        public float Price { get; set; }

        [Column("stock_status")]
        public string StockStatus { get; set; }

        // Navigation property to Product
        [ForeignKey("Pid")]
        public Product Product { get; set; }

        // Optionally, if you have a Shopkeeper or Store model
        // [ForeignKey("Sid")]
        // public Shopkeeper Shopkeeper { get; set; }
    }
}
