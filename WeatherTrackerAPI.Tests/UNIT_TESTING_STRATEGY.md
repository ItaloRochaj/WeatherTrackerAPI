# Testes Unitários Específicos para WeatherTrackerAPI

## Estrutura de Testes Recomendada para o Projeto

### 📁 Organização dos Testes

```text
WeatherTrackerAPI.Tests/
├── Unit/
│   ├── Controllers/
│   │   ├── AuthControllerTests.cs
│   │   ├── NasaControllerTests.cs
│   │   └── TestControllerTests.cs
│   ├── Services/
│   │   ├── AuthServiceTests.cs
│   │   └── NasaServiceTests.cs
│   ├── Repositories/
│   │   ├── UserRepositoryTests.cs
│   │   └── ApodRepositoryTests.cs
│   └── Models/
│       ├── UserTests.cs
│       └── ApodEntityTests.cs
├── Integration/
│   ├── AuthIntegrationTests.cs
│   └── NasaIntegrationTests.cs
└── Helpers/
    ├── TestDataBuilders.cs
    └── TestDbContext.cs
```

## 🧪 Exemplos de Testes por Camada

### 1. **Testes de Controllers**

#### AuthController

```csharp
public class AuthControllerTests
{
    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkWithToken()
    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    [Fact]
    public async Task Register_ValidData_ReturnsCreated()
    [Fact]
    public async Task Register_DuplicateEmail_ReturnsBadRequest()
}
```

#### NasaController

```csharp
public class NasaControllerTests
{
    [Fact]
    public async Task GetApod_ValidDate_ReturnsApodData()
    [Fact]
    public async Task GetApod_InvalidDate_ReturnsBadRequest()
    [Fact]
    public async Task RateApod_ValidRating_ReturnsSuccess()
    [Fact]
    public async Task GetTrends_ReturnsAggregatedData()
}
```

### 2. **Testes de Services**

#### AuthService

```csharp
public class AuthServiceTests
{
    [Fact]
    public async Task LoginAsync_ValidUser_ReturnsLoginResponse()
    [Fact]
    public async Task LoginAsync_InvalidPassword_ThrowsException()
    [Fact]
    public async Task RegisterAsync_NewUser_CreatesUser()
    [Fact]
    public async Task GenerateJwtToken_ValidUser_ReturnsValidToken()
    [Fact]
    public async Task ValidateTokenAsync_ValidToken_ReturnsTrue()
}
```

#### NasaService

```csharp
public class NasaServiceTests
{
    [Fact]
    public async Task GetApodAsync_ValidDate_ReturnsApodResponse()
    [Fact]
    public async Task GetApodAsync_ApiFailure_HandlesGracefully()
    [Fact]
    public async Task SyncApodData_NewData_SavesToDatabase()
    [Fact]
    public async Task GetTrendsAsync_ReturnsAggregatedRatings()
}
```

### 3. **Testes de Repositories**

#### UserRepository

```csharp
public class UserRepositoryTests
{
    [Fact]
    public async Task GetByEmailAsync_ExistingUser_ReturnsUser()
    [Fact]
    public async Task GetByEmailAsync_NonExistingUser_ReturnsNull()
    [Fact]
    public async Task CreateAsync_ValidUser_CreatesSuccessfully()
    [Fact]
    public async Task UpdateAsync_ExistingUser_UpdatesSuccessfully()
}
```

#### ApodRepository

```csharp
public class ApodRepositoryTests
{
    [Fact]
    public async Task GetByDateAsync_ExistingApod_ReturnsApod()
    [Fact]
    public async Task GetTrendsAsync_ReturnsRatingStatistics()
    [Fact]
    public async Task AddRatingAsync_ValidRating_AddsSuccessfully()
    [Fact]
    public async Task GetRatingsByUserAsync_ReturnsUserRatings()
}
```

### 4. **Testes de Models/DTOs**

#### User Model

```csharp
public class UserTests
{
    [Fact]
    public void User_Creation_GeneratesValidId()
    [Fact]
    public void User_EmailValidation_ValidatesCorrectly()
    [Fact]
    public void User_PasswordHash_StoresSecurely()
    [Fact]
    public void User_FullName_CombinesNamesCorrectly()
}
```

### 5. **Testes de Integração**

#### Auth Integration

```csharp
public class AuthIntegrationTests
{
    [Fact]
    public async Task LoginFlow_EndToEnd_WorksCorrectly()
    [Fact]
    public async Task RegisterFlow_EndToEnd_CreatesUserAndAllowsLogin()
    [Fact]
    public async Task TokenValidation_RealToken_ValidatesCorrectly()
}
```

## 🛠️ Cenários de Teste Específicos

### **Autenticação & Autorização**

- ✅ Login com credenciais válidas
- ✅ Login com credenciais inválidas
- ✅ Registro de novo usuário
- ✅ Registro com email duplicado
- ✅ Validação de token JWT
- ✅ Token expirado
- ✅ Token inválido

### **API NASA APOD**

- ✅ Busca de APOD por data válida
- ✅ Busca com data inválida
- ✅ Sincronização de dados
- ✅ Falha na API externa
- ✅ Cache de dados
- ✅ Rate limiting

### **Sistema de Avaliações**

- ✅ Avaliação válida (1-5 estrelas)
- ✅ Avaliação inválida (fora do range)
- ✅ Múltiplas avaliações do mesmo usuário
- ✅ Cálculo de médias
- ✅ Trending de avaliações

### **Persistência de Dados**

- ✅ Operações CRUD completas
- ✅ Relacionamentos entre entidades
- ✅ Constraints de banco
- ✅ Transações
- ✅ Performance de queries

## 🎯 Tipos de Testes por Complexidade

### **Básicos (Unit)**

- Métodos individuais
- Lógica de negócio isolada
- Validações
- Transformações de dados

### **Intermediários (Integration)**

- Interação entre camadas
- Acesso a banco de dados
- Chamadas HTTP
- Middleware

### **Avançados (E2E)**

- Fluxos completos
- Múltiplos usuários
- Cenários reais
- Performance

## 📊 Métricas de Qualidade

### **Cobertura Recomendada**

- Controllers: 90%+
- Services: 95%+
- Repositories: 90%+
- Models: 80%+

### **Tipos de Asserções**

- Valores de retorno
- Exceções lançadas
- Estados de objetos
- Interações com mocks
- Performance (tempo)

Esta estrutura garante cobertura completa e testes robustos para o projeto WeatherTrackerAPI! 🚀
