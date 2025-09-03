using System.ComponentModel.DataAnnotations;

namespace WeatherTrackerAPI.DTOs
{
    public class RatingDto
    {
        [Required]
        [Range(1, 5, ErrorMessage = "A avaliação deve ser entre 1 e 5")]
        public double Rating { get; set; }
    }
}
