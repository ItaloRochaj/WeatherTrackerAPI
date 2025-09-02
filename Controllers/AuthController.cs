using Microsoft.AspNetCore.Mvc;
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

        /// <summary>
        /// Realiza login do usuário
        /// </summary>
        /// <param name="loginDto">Dados de login</param>
        /// <returns>Token JWT e informações do usuário</returns>
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

        /// <summary>
        /// Registra um novo usuário
        /// </summary>
        /// <param name="registerDto">Dados de registro</param>
        /// <returns>Informações do usuário criado</returns>
        [HttpPost("register")]
        [ProducesResponseType(typeof(RegisterResponseDto), 201)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 409)]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
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

        /// <summary>
        /// Valida um token JWT
        /// </summary>
        /// <param name="validateTokenDto">Token a ser validado</param>
        /// <returns>Status da validação</returns>
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

                var result = await _authService.ValidateTokenAsync(validateTokenDto.Token);
                
                if (result)
                {
                    // Aqui você pode extrair informações do token se necessário
                    var response = new ValidateTokenResponseDto
                    {
                        IsValid = true,
                        Message = "Token válido"
                    };
                    return Ok(response);
                }
                else
                {
                    var response = new ValidateTokenResponseDto
                    {
                        IsValid = false,
                        Message = "Token inválido ou expirado"
                    };
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
    }
}