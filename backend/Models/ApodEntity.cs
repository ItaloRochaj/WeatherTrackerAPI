using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeatherTrackerAPI.Models
{
    [Table("ApodData")]
    public class ApodEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Explanation { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Url { get; set; }

        [MaxLength(2000)]
        public string? HdUrl { get; set; }

        [MaxLength(50)]
        public string MediaType { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Copyright { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int ViewCount { get; set; } = 0;
        public double? Rating { get; set; }
        public bool IsFavorited { get; set; } = false;
    }
}