using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerApp.Models
{
    [Table("category")]
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("catid")]
        public int CatId { get; set; }

        [Required]
        [Column("catname")]
        [StringLength(100)]
        public string CatName { get; set; }

        // Navigation property
        public virtual ICollection<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
    }
}
