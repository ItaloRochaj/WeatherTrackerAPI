using System;
using WeatherTrackerAPI.Models;
using WeatherTrackerAPI.DTOs;

namespace WeatherTrackerAPI.Tests
{
    public class SpecificTestRunner
    {
        public static void RunProjectSpecificTests()
        {
            Console.WriteLine("=== Executando Testes Específicos do WeatherTrackerAPI ===");
            
            TestUserModelCreation();
            TestApodDtoValidation();
            TestPasswordHashingLogic();
            TestDateTimeHandling();
            
            Console.WriteLine("=== Testes específicos concluídos ===");
        }
        
        public static void TestUserModelCreation()
        {
            Console.WriteLine("Teste: Criação de Modelo User");
            
            try
            {
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = "test@example.com",
                    PasswordHash = "hashedpassword123",
                    CreatedAt = DateTime.UtcNow
                };
                
                if (user.Id != Guid.Empty && user.Email == "test@example.com")
                {
                    Console.WriteLine("✓ Criação de User: PASSOU");
                }
                else
                {
                    Console.WriteLine("✗ Criação de User: FALHOU");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Criação de User: FALHOU - {ex.Message}");
            }
        }
        
        public static void TestApodDtoValidation()
        {
            Console.WriteLine("Teste: Validação de ApodDto");
            
            try
            {
                var apodDto = new ApodDto
                {
                    Id = Guid.NewGuid(),
                    Title = "Test APOD",
                    Explanation = "Test explanation",
                    Date = DateTime.Today,
                    Url = "https://example.com/image.jpg",
                    MediaType = "image",
                    CreatedAt = DateTime.UtcNow
                };
                
                bool isValid = !string.IsNullOrEmpty(apodDto.Title) && 
                              !string.IsNullOrEmpty(apodDto.Explanation) &&
                              apodDto.Date != default(DateTime) &&
                              !string.IsNullOrEmpty(apodDto.Url);
                
                if (isValid)
                {
                    Console.WriteLine("✓ Validação de ApodDto: PASSOU");
                }
                else
                {
                    Console.WriteLine("✗ Validação de ApodDto: FALHOU");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Validação de ApodDto: FALHOU - {ex.Message}");
            }
        }
        
        public static void TestPasswordHashingLogic()
        {
            Console.WriteLine("Teste: Lógica de Hash de Senha (simulado)");
            
            try
            {
                string password = "minhasenha123";
                
                // Simulando hash básico (não usar em produção!)
                string hashedPassword = Convert.ToBase64String(
                    System.Text.Encoding.UTF8.GetBytes(password + "salt"));
                
                bool passwordMatches = Convert.ToBase64String(
                    System.Text.Encoding.UTF8.GetBytes(password + "salt")) == hashedPassword;
                
                if (passwordMatches && !string.IsNullOrEmpty(hashedPassword))
                {
                    Console.WriteLine("✓ Hash de senha simulado: PASSOU");
                }
                else
                {
                    Console.WriteLine("✗ Hash de senha simulado: FALHOU");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Hash de senha simulado: FALHOU - {ex.Message}");
            }
        }
        
        public static void TestDateTimeHandling()
        {
            Console.WriteLine("Teste: Manipulação de DateTime para NASA API");
            
            try
            {
                DateTime today = DateTime.Today;
                string dateString = today.ToString("yyyy-MM-dd");
                
                bool canParseBack = DateTime.TryParseExact(dateString, "yyyy-MM-dd", 
                    null, System.Globalization.DateTimeStyles.None, out DateTime parsedDate);
                
                if (canParseBack && parsedDate.Date == today.Date)
                {
                    Console.WriteLine("✓ Manipulação de DateTime: PASSOU");
                }
                else
                {
                    Console.WriteLine("✗ Manipulação de DateTime: FALHOU");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Manipulação de DateTime: FALHOU - {ex.Message}");
            }
        }
    }
}
