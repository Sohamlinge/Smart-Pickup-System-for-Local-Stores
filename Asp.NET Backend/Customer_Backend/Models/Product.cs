using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerApp.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("pid")]
        public int Pid { get; set; }

        [Required]
        [Column("subcatid")]
        public int SubCatId { get; set; }

        [Required]
        [Column("pname")]
        [StringLength(100)]
        public string Pname { get; set; }

        [Column("description")]
        [StringLength(500)]
        public string? Description { get; set; }

        [Column("image")]
        [StringLength(300)]
        public string? Image { get; set; }

        [ForeignKey("SubCatId")]
        public SubCategory? SubCategory { get; set; }

        public ICollection<ProductShopkeeper>? ProductShopkeepers { get; set; }
    }
}
