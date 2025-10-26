using System.ComponentModel.DataAnnotations;

namespace WeatherTrackerAPI.DTOs
{
    public class UpdateProfilePictureDto
    {
        [Required]
        public string ProfilePicture { get; set; } = string.Empty;
    }
}
