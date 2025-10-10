using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerApp.Models
{
    [Table("shopkeeper")]
    public class Shopkeeper
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("sid")]
        public int sid { get; set; }

        [Required]
        [Column("uid")]
        public int uid { get; set; }

        [Required]
        [Column("sname")]
        [StringLength(100)]
        public string sname { get; set; }

        [Required]
        [Column("gstno")]
        [StringLength(100)]
        public string gstno { get; set; }

        [Required]
        [Column("sphoneno")]
        public long sphoneno { get; set; }

        [Required]
        [Column("saddress")]
        [StringLength(100)]
        public string SAddress { get; set; }
    }
}
