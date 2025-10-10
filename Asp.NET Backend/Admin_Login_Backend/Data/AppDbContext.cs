using Microsoft.EntityFrameworkCore;
using Admin_Login.Models;

namespace Admin_Login.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Shopkeeper> Shopkeepers { get; set; }
        public DbSet<Order> Orders { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define relationship: Many SubCategories to One Category
            modelBuilder.Entity<SubCategory>()
                .HasOne(sc => sc.Category)
                .WithMany() // No navigation on Category
                .HasForeignKey(sc => sc.CatId)              
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
