using System.ComponentModel.DataAnnotations;

namespace WeatherTrackerAPI.DTOs
{
    /// <summary>
    /// DTO para avaliação de APOD
    /// </summary>
    public class RatingDto
    {
        /// <summary>
        /// Avaliação da APOD (1-5)
        /// </summary>
        [Required]
        [Range(1, 5, ErrorMessage = "A avaliação deve ser entre 1 e 5")]
        public double Rating { get; set; }
    }
}
