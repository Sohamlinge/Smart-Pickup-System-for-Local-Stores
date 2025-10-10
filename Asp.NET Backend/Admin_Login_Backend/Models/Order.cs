using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Admin_Login.Models
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("orderid")]
        public int OrderId { get; set; }

        [Column("totalprice")]
        public float TotalPrice { get; set; }

        [Column("time")]
        public TimeSpan Time { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }
    }
}

