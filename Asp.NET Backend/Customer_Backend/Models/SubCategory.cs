using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerApp.Models
{
    [Table("subcategory")]
    public class SubCategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("subcatid")]
        public int SubCatId { get; set; }

        [Required]
        [Column("catid")]
        public int CatId { get; set; }

        [Required]
        [Column("subcatname")]
        [StringLength(100)]
        public string SubCatName { get; set; }

        [ForeignKey("CatId")]
        public Category Category { get; set; }

        public ICollection<Product>? Products { get; set; }

    }
}
