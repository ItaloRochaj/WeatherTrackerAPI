using WeatherTrackerAPI.DTOs;

namespace WeatherTrackerAPI.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
        Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<ValidateTokenResponseDto> ValidateTokenWithUserAsync(ValidateTokenDto validateTokenDto);
        Task<ForgotPasswordResponseDto> ForgotPasswordAsync(string email);
        Task<ResetPasswordResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
        Task<bool> ValidateResetTokenAsync(string token);
    }
}