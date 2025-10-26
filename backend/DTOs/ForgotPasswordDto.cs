using System.ComponentModel.DataAnnotations;

namespace WeatherTrackerAPI.DTOs
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class ForgotPasswordResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class ResetPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}