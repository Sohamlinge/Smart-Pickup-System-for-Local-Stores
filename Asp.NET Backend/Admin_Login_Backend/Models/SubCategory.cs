using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
//using Newtonsoft.Json;

namespace Admin_Login.Models
{
    [Table("subcategory")]
    public class SubCategory
    {
        [Key]
        [Column("subcatid")]
        public int SubCatId { get; set; }

        [Required]
        [Column("subcatname")]
        public string SubCatName { get; set; }

        [Required]
        [ForeignKey("Category")]
        [Column("catid")]
        public int CatId { get; set; }

        [ValidateNever]
        [JsonIgnore]
        public Category Category { get; set; }

        [ValidateNever]
        [JsonIgnore]
        public ICollection<Product> Products { get; set; }
    }
}
