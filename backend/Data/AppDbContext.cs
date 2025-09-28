using Microsoft.EntityFrameworkCore;
using WeatherTrackerAPI.Models;

namespace WeatherTrackerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ApodEntity> ApodData { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(50).HasDefaultValue("User");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
            });

            // Configure ApodEntity
            modelBuilder.Entity<ApodEntity>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Date).IsUnique();
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Explanation).IsRequired().HasColumnType("NVARCHAR(MAX)");
                entity.Property(e => e.Url).HasMaxLength(2000);
                entity.Property(e => e.HdUrl).HasMaxLength(2000);
                entity.Property(e => e.MediaType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Copyright).HasMaxLength(200);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.ViewCount).HasDefaultValue(0);
                entity.Property(e => e.IsFavorited).HasDefaultValue(false);
            });

            // Note: Seed data removed to avoid migration issues
            // Admin user will be created programmatically on first run
        }
    }
}