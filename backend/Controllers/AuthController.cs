using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using WeatherTrackerAPI.DTOs;
using WeatherTrackerAPI.Services;

namespace WeatherTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [Authorize]
        [HttpPut("profile-picture")]
        [ProducesResponseType(typeof(UserDto), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> UpdateProfilePicture([FromBody] UpdateProfilePictureDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.ProfilePicture))
                {
                    return BadRequest(new { message = "Imagem de perfil inválida" });
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var updated = await _authService.UpdateProfilePictureAsync(userId, dto.ProfilePicture);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar imagem de perfil");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponseDto), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 401)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.LoginAsync(loginDto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized login attempt");
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(RegisterResponseDto), 201)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 409)]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (registerDto == null)
                {
                    _logger.LogWarning("Null registration data received");
                    return BadRequest(new { message = "Dados de registro não fornecidos" });
                }

                _logger.LogInformation("Register attempt for email: {Email}", registerDto.Email);
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state for registration: {Errors}", 
                        string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
                    return BadRequest(ModelState);
                }

                var result = await _authService.RegisterAsync(registerDto);
                return CreatedAtAction(nameof(Register), new { id = result.Id }, result);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Registration conflict");
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        [HttpPost("validate")]
        [ProducesResponseType(typeof(ValidateTokenResponseDto), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenDto validateTokenDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.ValidateTokenWithUserAsync(validateTokenDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(ForgotPasswordResponseDto), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.ForgotPasswordAsync(forgotPasswordDto.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing forgot password request");
                return StatusCode(500, new { success = false, message = "Erro ao processar solicitação de redefinição de senha" });
            }
        }

        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(ResetPasswordResponseDto), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.ResetPasswordAsync(resetPasswordDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting password");
                return StatusCode(500, new { success = false, message = "Erro ao redefinir senha" });
            }
        }

        [HttpGet("validate-reset-token/{token}")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> ValidateResetToken(string token)
        {
            try
            {
                var isValid = await _authService.ValidateResetTokenAsync(token);
                return Ok(new { success = isValid, message = isValid ? "Token válido" : "Token inválido" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating reset token");
                return StatusCode(500, new { success = false, message = "Erro ao validar token" });
            }
        }
    }
}