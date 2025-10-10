using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Admin_Login.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("uid")]
        public int Uid { get; set; }

        [Column("rid")]
        public int Rid { get; set; }

        [Column("uname")]
        public string Uname { get; set; }

        [Column("password")]
        public string Password { get; set; }

        [Column("phoneno")]
        public long Phoneno { get; set; } // ✅ Updated to match BIGINT

        [Column("address")]
        public string Address { get; set; }

        [Column("aadharno")]
        public string Aadharno { get; set; }
    }
}
