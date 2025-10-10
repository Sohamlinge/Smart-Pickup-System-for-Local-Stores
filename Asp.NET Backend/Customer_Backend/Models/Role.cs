using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerApp.Models
{
    [Table("role")]
    public class Role
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("rid")]
        public int Rid { get; set; }

        [Required]
        [Column("rname")]
        [StringLength(100)]
        public string Rname { get; set; }
    }
}
