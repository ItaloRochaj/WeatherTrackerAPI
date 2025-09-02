using System.ComponentModel.DataAnnotations;

namespace WeatherTrackerAPI.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        [MinLength(8, ErrorMessage = "Senha deve ter pelo menos 8 caracteres")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", 
            ErrorMessage = "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
        [Compare("Password", ErrorMessage = "Senha e confirmação não coincidem")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nome é obrigatório")]
        [MinLength(2, ErrorMessage = "Nome deve ter pelo menos 2 caracteres")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Sobrenome é obrigatório")]
        [MinLength(2, ErrorMessage = "Sobrenome deve ter pelo menos 2 caracteres")]
        [MaxLength(100, ErrorMessage = "Sobrenome deve ter no máximo 100 caracteres")]
        public string LastName { get; set; } = string.Empty;
    }

    public class RegisterResponseDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
        public string Message { get; set; } = "Usuário criado com sucesso!";
    }
}