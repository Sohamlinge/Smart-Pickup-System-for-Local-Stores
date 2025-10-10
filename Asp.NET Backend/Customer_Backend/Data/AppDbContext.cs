using CustomerApp.Models;
using Microsoft.EntityFrameworkCore;
using SmartPickupAPI.Models;

namespace CustomerApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductShopkeeper> ProductShopkeepers { get; set; }
        public DbSet<Shopkeeper> Shopkeepers { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetails> OrderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .HasMany(p => p.ProductShopkeepers)
                .WithOne(ps => ps.Product)
                .HasForeignKey(ps => ps.Pid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SubCategory>()
                .HasMany(sc => sc.Products)
                .WithOne(p => p.SubCategory)
                .HasForeignKey(p => p.SubCatId);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.SubCategories)
                .WithOne(sc => sc.Category)
                .HasForeignKey(sc => sc.CatId);

            modelBuilder.Entity<ProductShopkeeper>()
                .HasOne(ps => ps.Shopkeeper)
                .WithMany()
                .HasForeignKey(ps => ps.Sid);
            modelBuilder.Entity<Shopkeeper>()
    .HasOne<User>()
    .WithMany()
    .HasForeignKey(s => s.uid)
    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.Uid);

            modelBuilder.Entity<Cart>()
                .HasOne(c => c.ProductShopkeeper)
                .WithMany()
                .HasForeignKey(c => c.Spid);

            modelBuilder.Entity<OrderDetails>()
     .HasOne<Order>(od => od.Order)
     .WithMany(o => o.OrderDetails)
     .HasForeignKey(od => od.OrderId)
     .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderDetails>()
                .HasOne<ProductShopkeeper>(od => od.ProductShopkeeper)
                .WithMany()
                .HasForeignKey(od => od.Spid)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("orders"); // or the exact table name

                entity.HasKey(e => e.OrderId);

                entity.Property(e => e.OrderId).HasColumnName("orderid");

                entity.Property(e => e.TotalPrice).HasColumnName("totalprice");

                entity.Property(e => e.CustId).HasColumnName("custid");

                entity.Property(e => e.sid).HasColumnName("sid");

                entity.Property(e => e.CustomerDatetime)
                      .HasColumnName("customer_datetime");

                entity.Property(e => e.ShopkeeperDatetime)
                      .HasColumnName("shopkeeper_datetime");

                entity.Property(e => e.OrderStatus)
                      .HasColumnName("order_status");
            });



            base.OnModelCreating(modelBuilder);
        }
    }
}
