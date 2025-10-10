using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Admin_Login.Models
{
    [Table("category")]
    public class Category
    {
        [Key]
        [Column("catid")]
        public int CatId { get; set; }

        [Required]
        [Column("catname")]
        public string CatName { get; set; }
    }
}
