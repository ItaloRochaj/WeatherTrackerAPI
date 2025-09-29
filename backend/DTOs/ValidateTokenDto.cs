using System.ComponentModel.DataAnnotations;

namespace WeatherTrackerAPI.DTOs
{
    public class ValidateTokenDto
    {
        [Required(ErrorMessage = "Token é obrigatório")]
        public string Token { get; set; } = string.Empty;
    }

    public class ValidateTokenResponseDto
    {
        public bool IsValid { get; set; }
        public UserDto? User { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
