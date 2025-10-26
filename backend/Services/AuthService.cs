using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WeatherTrackerAPI.Configurations;
using WeatherTrackerAPI.DTOs;
using WeatherTrackerAPI.Models;
using WeatherTrackerAPI.Repositories;

namespace WeatherTrackerAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;
        private readonly ILogger<AuthService> _logger;
        private readonly IEmailService _emailService;

        public AuthService(
            IUserRepository userRepository,
            IOptions<JwtSettings> jwtSettings,
            ILogger<AuthService> logger,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _jwtSettings = jwtSettings.Value;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Failed login attempt for email: {Email}", loginDto.Email);
                throw new UnauthorizedAccessException("Email ou senha inválidos");
            }

            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes);

            _logger.LogInformation("User {Email} logged in successfully", user.Email);

            return new LoginResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id.ToString(),
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt ?? DateTime.UtcNow
                },
                ExpiresAt = expiresAt
            };
        }

        public async Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            if (await _userRepository.EmailExistsAsync(registerDto.Email))
            {
                throw new InvalidOperationException("Email já está em uso");
            }

            var user = new User
            {
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Role = "User",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.CreateAsync(user);

            _logger.LogInformation("New user registered: {Email}", createdUser.Email);

            return new RegisterResponseDto
            {
                Id = createdUser.Id,
                Email = createdUser.Email,
                FirstName = createdUser.FirstName,
                LastName = createdUser.LastName,
                CreatedAt = createdUser.CreatedAt
            };
        }

        public Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return Task.FromResult(true);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        public async Task<ValidateTokenResponseDto> ValidateTokenWithUserAsync(ValidateTokenDto validateTokenDto)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

                var principal = tokenHandler.ValidateToken(validateTokenDto.Token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim != null && Guid.TryParse(userIdClaim, out var userId))
                {
                    var user = await _userRepository.GetByIdAsync(userId);
                    if (user != null)
                    {
                        return new ValidateTokenResponseDto
                        {
                            IsValid = true,
                            User = new UserDto
                            {
                                Id = user.Id.ToString(),
                                Email = user.Email,
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                Role = user.Role,
                                CreatedAt = user.CreatedAt ?? DateTime.UtcNow
                            },
                            Message = "Token válido"
                        };
                    }
                }

                return new ValidateTokenResponseDto
                {
                    IsValid = false,
                    Message = "Usuário não encontrado"
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Token validation failed");
                return new ValidateTokenResponseDto
                {
                    IsValid = false,
                    Message = "Token inválido"
                };
            }
        }

        public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                // Não revelar se o email existe ou não por segurança
                return new ForgotPasswordResponseDto 
                { 
                    Success = true,
                    Message = "Se o email existir no sistema, você receberá as instruções para redefinir sua senha." 
                };
            }

            // Gerar token de redefinição de senha
            var resetToken = Guid.NewGuid().ToString();
            user.PasswordResetToken = resetToken;
            user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1);
            
            await _userRepository.UpdateAsync(user);

            // Enviar email com o link de redefinição
            var resetLink = $"http://localhost:4200/reset-password?token={resetToken}&email={email}";
            var emailBody = $@"
                <h2>Redefinição de Senha</h2>
                <p>Você solicitou a redefinição de sua senha.</p>
                <p>Clique no link abaixo para criar uma nova senha:</p>
                <p><a href='{resetLink}'>Redefinir Senha</a></p>
                <p>Este link expira em 1 hora.</p>
                <p>Se você não solicitou esta redefinição, ignore este email.</p>";

            await _emailService.SendEmailAsync(email, "Redefinição de Senha - Weather Tracker API", emailBody);

            return new ForgotPasswordResponseDto 
            { 
                Success = true,
                Message = "Se o email existir no sistema, você receberá as instruções para redefinir sua senha." 
            };
        }

        public async Task<ResetPasswordResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userRepository.GetByEmailAsync(resetPasswordDto.Email);
            if (user == null || user.PasswordResetToken != resetPasswordDto.Token ||
                !user.PasswordResetTokenExpires.HasValue || 
                user.PasswordResetTokenExpires.Value < DateTime.UtcNow)
            {
                throw new InvalidOperationException("Token inválido ou expirado");
            }

            // Atualizar senha
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;

            await _userRepository.UpdateAsync(user);

            return new ResetPasswordResponseDto 
            { 
                Success = true,
                Message = "Senha atualizada com sucesso" 
            };
        }

        public async Task<bool> ValidateResetTokenAsync(string token)
        {
            var user = await _userRepository.GetByResetTokenAsync(token);
            return user != null && 
                   user.PasswordResetTokenExpires.HasValue && 
                   user.PasswordResetTokenExpires.Value > DateTime.UtcNow;
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}