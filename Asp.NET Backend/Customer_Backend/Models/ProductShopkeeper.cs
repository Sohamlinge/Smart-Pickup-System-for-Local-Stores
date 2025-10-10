using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerApp.Models
{
    [Table("product_shopkeeper")]
    public class ProductShopkeeper
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("spid")]
        public int Spid { get; set; }

        [Required]
        [Column("sid")]
        public int Sid { get; set; }

        [Required]
        [Column("pid")]
        public int Pid { get; set; }

        [Required]
        [Column("price")]
        public float Price { get; set; }

        [Required]
        [Column("stock_status")]
        [StringLength(100)]
        public string StockStatus { get; set; }

        [ForeignKey("Pid")]
        public Product? Product { get; set; }

        [ForeignKey("Sid")]
        public Shopkeeper? Shopkeeper { get; set; }
    }
}
