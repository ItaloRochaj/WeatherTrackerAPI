using System;

namespace WeatherTrackerAPI.Tests
{
    public class BasicTestRunner
    {
        public static void RunAllTests()
        {
            Console.WriteLine("=== Executando Testes Básicos ===");
            
            TestBasicMath();
            TestStringOperations();
            TestDateTimeOperations();
            TestCollections();
            
            Console.WriteLine("=== Todos os testes concluídos ===");
        }
        
        public static void TestBasicMath()
        {
            Console.WriteLine("Teste: Operações Matemáticas Básicas");
            
            // Teste de adição
            int result = 2 + 3;
            if (result == 5)
            {
                Console.WriteLine("✓ Adição: PASSOU");
            }
            else
            {
                Console.WriteLine("✗ Adição: FALHOU");
            }
            
            // Teste de multiplicação
            int multiply = 4 * 5;
            if (multiply == 20)
            {
                Console.WriteLine("✓ Multiplicação: PASSOU");
            }
            else
            {
                Console.WriteLine("✗ Multiplicação: FALHOU");
            }
        }
        
        public static void TestStringOperations()
        {
            Console.WriteLine("Teste: Operações de String");
            
            string test = "Hello World";
            if (test.Length == 11)
            {
                Console.WriteLine("✓ Comprimento da string: PASSOU");
            }
            else
            {
                Console.WriteLine("✗ Comprimento da string: FALHOU");
            }
            
            if (test.Contains("World"))
            {
                Console.WriteLine("✓ Contém substring: PASSOU");
            }
            else
            {
                Console.WriteLine("✗ Contém substring: FALHOU");
            }
        }
        
        public static void TestDateTimeOperations()
        {
            Console.WriteLine("Teste: Operações de DateTime");
            
            DateTime now = DateTime.Now;
            DateTime future = now.AddDays(1);
            
            if (future > now)
            {
                Console.WriteLine("✓ Comparação de datas: PASSOU");
            }
            else
            {
                Console.WriteLine("✗ Comparação de datas: FALHOU");
            }
        }
        
        public static void TestCollections()
        {
            Console.WriteLine("Teste: Operações de Coleções");
            
            var list = new System.Collections.Generic.List<int> { 1, 2, 3, 4, 5 };
            
            if (list.Count == 5)
            {
                Console.WriteLine("✓ Contagem de lista: PASSOU");
            }
            else
            {
                Console.WriteLine("✗ Contagem de lista: FALHOU");
            }
            
            if (list.Contains(3))
            {
                Console.WriteLine("✓ Lista contém elemento: PASSOU");
            }
            else
            {
                Console.WriteLine("✗ Lista contém elemento: FALHOU");
            }
        }
    }
}
