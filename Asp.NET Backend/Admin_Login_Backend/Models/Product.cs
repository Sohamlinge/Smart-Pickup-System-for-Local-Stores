using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Admin_Login.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("pid")]
        public int Pid { get; set; }

        [Required]
        [Column("pname")]
        public string Pname { get; set; }

        [Required]
        [Column("description")]
        public string Description { get; set; }

        [Required]
        [Column("image")]
        public string Image { get; set; }

        [Required]
        [ForeignKey("SubCategory")]
        [Column("subcatid")]
        public int SubCatId { get; set; }

        public SubCategory SubCategory { get; set; }

        [NotMapped]
        public string ImageUrl => $"/images/{Image}";
    }
}
