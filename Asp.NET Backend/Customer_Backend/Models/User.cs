using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartPickupAPI.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("uid")]
        public int Uid { get; set; }

        [Required]
        [Column("rid")]
        public int Rid { get; set; }

        [Required]
        [Column("uname")]
        public string Uname { get; set; }

        [Required]
        [Column("password")]
        public string Password { get; set; }

        [Required]
        [Column("phoneno")]
        public int PhoneNo { get; set; }

        [Required]
        [Column("address")]
        public string Address { get; set; }

        [Required]
        [Column("aadhar_no")]
        public string AadharNo { get; set; }
    }
}
