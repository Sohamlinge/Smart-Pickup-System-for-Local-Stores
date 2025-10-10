using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Admin_Login.Models;

namespace Admin_Login.Models
{
    [Table("shopkeeper")]
    public class Shopkeeper
    {
        [Key]
        [Column("sid")]
        public int Sid { get; set; }

        [Required]
        [Column("sname")]
        public string Sname { get; set; }

        [Required]
        [Column("gstno")]
        public string Gstno { get; set; }

        [Required]
        [Column("sphoneno")]
        public long Sphoneno { get; set; } 

        [Required]
        [Column("saddress")]
        public string Saddress { get; set; }

        [ForeignKey("User")]
        [Column("uid")]
        public int Uid { get; set; }
    }
}
