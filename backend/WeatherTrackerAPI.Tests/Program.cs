using System;

namespace WeatherTrackerAPI.Tests
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== WeatherTrackerAPI - Suite de Testes ===");
            Console.WriteLine($"Data: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
            Console.WriteLine();
            
            // Testes básicos
            BasicTestRunner.RunAllTests();
            
            Console.WriteLine();
            
            // Testes específicos do projeto
            SpecificTestRunner.RunProjectSpecificTests();
            
            Console.WriteLine();
            Console.WriteLine("Pressione qualquer tecla para sair...");
            Console.ReadKey();
        }
    }
}
