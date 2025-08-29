# Especificações Técnicas - WeatherTrackerAPI

## 📋 Requisitos da Avaliação vs. Implementação

### ✅ Requisitos Atendidos

| Requisito | Status | Implementação |
|-----------|--------|---------------|
| **API Web .NET 8+** | ✅ Completo | .NET 9 com ASP.NET Core |
| **Integração API Externa** | ✅ Completo | NASA APOD API |
| **Controlador API** | ✅ Completo | NasaController + AuthController |
| **Processar/Transformar Dados** | ✅ Completo | AutoMapper + DTOs |
| **Persistir Dados** | ✅ Completo | Entity Framework + SQL Server |
| **Banco de Dados** | ✅ Completo | SQL Server com EF Core |
| **Autenticação JWT** | ✅ Completo | JWT Bearer Authentication |
| **Documentação Swagger** | ✅ Completo | OpenAPI 3.0 + Swagger UI |
| **Histórico Commits** | ✅ Completo | Git com commits incrementais |
| **README Detalhado** | ✅ Completo | Documentação abrangente |
| **.gitignore** | ✅ Completo | Proteção de dados sensíveis |

### 🎯 Funcionalidades Extras Implementadas

- **Rate Limiting** para NASA API
- **Cache em Memória** para otimização
- **Health Checks** para monitoramento
- **Logging Estruturado** com Serilog
- **Validation** com FluentValidation
- **Background Services** para sincronização
- **Testes Unitários e Integração**
- **Docker Support**
- **CI/CD Pipeline**

## 🏗️ Arquitetura Detalhada

### Padrões Arquiteturais

#### 1. Clean Architecture
```
┌─────────────────────────────────────┐
│           Controllers               │ ← Presentation Layer
├─────────────────────────────────────┤
│           Services                  │ ← Business Logic Layer
├─────────────────────────────────────┤
│         Repositories                │ ← Data Access Layer
├─────────────────────────────────────┤
│      Models/Entities                │ ← Domain Layer
└─────────────────────────────────────┘
```

#### 2. Dependency Injection
```csharp
// Configuração no Program.cs
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IApodRepository, ApodRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<INasaService, NasaService>();
```

#### 3. Repository Pattern
```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
```

### Fluxo de Dados

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│ Controller  │───▶│   Service   │───▶│ Repository  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                            │                   │                   │
                            ▼                   ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │     DTO     │    │ Business    │    │  Database   │
                   │ Validation  │    │   Logic     │    │   Queries   │
                   └─────────────┘    └─────────────┘    └─────────────┘
```

## 📊 Modelo de Dados

### Diagrama ER

```sql
┌─────────────────────────────────────┐
│                Users                │
├─────────────────────────────────────┤
│ Id (PK)          UNIQUEIDENTIFIER   │
│ Email            NVARCHAR(255)      │
│ PasswordHash     NVARCHAR(255)      │
│ FirstName        NVARCHAR(100)      │
│ LastName         NVARCHAR(100)      │
│ Role             NVARCHAR(50)       │
│ CreatedAt        DATETIME2          │
│ UpdatedAt        DATETIME2          │
└─────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────┐
│             UserQueries             │
├─────────────────────────────────────┤
│ Id (PK)          UNIQUEIDENTIFIER   │
│ UserId (FK)      UNIQUEIDENTIFIER   │
│ QueryType        NVARCHAR(100)      │
│ QueryParameters  NVARCHAR(1000)     │
│ ExecutedAt       DATETIME2          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│               ApodData              │
├─────────────────────────────────────┤
│ Id (PK)          UNIQUEIDENTIFIER   │
│ Date             DATE (UNIQUE)      │
│ Title            NVARCHAR(500)      │
│ Explanation      NTEXT              │
│ Url              NVARCHAR(1000)     │
│ HdUrl            NVARCHAR(1000)     │
│ MediaType        NVARCHAR(50)       │
│ Copyright        NVARCHAR(255)      │
│ CreatedAt        DATETIME2          │
│ UpdatedAt        DATETIME2          │
└─────────────────────────────────────┘
```

### Relacionamentos e Constraints

```sql
-- Índices para Performance
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_ApodData_Date ON ApodData(Date);
CREATE INDEX IX_UserQueries_UserId ON UserQueries(UserId);
CREATE INDEX IX_UserQueries_ExecutedAt ON UserQueries(ExecutedAt);

-- Constraints
ALTER TABLE Users ADD CONSTRAINT UQ_Users_Email UNIQUE (Email);
ALTER TABLE ApodData ADD CONSTRAINT UQ_ApodData_Date UNIQUE (Date);
ALTER TABLE UserQueries ADD CONSTRAINT FK_UserQueries_Users 
    FOREIGN KEY (UserId) REFERENCES Users(Id);
```

## 🔐 Segurança

### Autenticação JWT

#### Configuração
```csharp
public class JwtSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationInMinutes { get; set; } = 60;
}
```

#### Geração de Token
```csharp
public string GenerateToken(User user)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
    };

    var token = new JwtSecurityToken(
        issuer: _jwtSettings.Issuer,
        audience: _jwtSettings.Audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### Validação e Sanitização

#### FluentValidation Rules
```csharp
public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email é obrigatório")
            .EmailAddress().WithMessage("Email deve ter formato válido")
            .MaximumLength(255).WithMessage("Email deve ter no máximo 255 caracteres");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Senha é obrigatória")
            .MinimumLength(8).WithMessage("Senha deve ter no mínimo 8 caracteres")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]")
            .WithMessage("Senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial");
    }
}
```

### Password Hashing
```csharp
public class PasswordService
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, 12);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
```

## 🚀 Performance e Otimização

### Caching Strategy

#### Memory Cache para NASA API
```csharp
public class CachedNasaService : INasaService
{
    private readonly INasaService _nasaService;
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromHours(24);

    public async Task<ApodDto?> GetApodAsync(DateTime date)
    {
        var cacheKey = $"apod_{date:yyyy-MM-dd}";
        
        if (_cache.TryGetValue<ApodDto>(cacheKey, out var cachedResult))
        {
            return cachedResult;
        }

        var result = await _nasaService.GetApodAsync(date);
        
        if (result != null)
        {
            _cache.Set(cacheKey, result, _cacheDuration);
        }

        return result;
    }
}
```

#### Database Query Optimization
```csharp
public class ApodRepository : IApodRepository
{
    public async Task<IEnumerable<ApodEntity>> GetApodsByDateRangeAsync(
        DateTime startDate, 
        DateTime endDate, 
        int pageNumber = 1, 
        int pageSize = 50)
    {
        return await _context.ApodData
            .Where(a => a.Date >= startDate && a.Date <= endDate)
            .OrderByDescending(a => a.Date)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking() // Read-only queries
            .ToListAsync();
    }
}
```

### Rate Limiting

#### NASA API Rate Limiting
```csharp
public class NasaApiRateLimiter
{
    private readonly SemaphoreSlim _semaphore;
    private readonly Queue<DateTime> _requestTimes;
    private readonly int _maxRequestsPerHour;

    public async Task<bool> WaitForAvailableSlotAsync()
    {
        await _semaphore.WaitAsync();
        
        try
        {
            var now = DateTime.UtcNow;
            var oneHourAgo = now.AddHours(-1);

            // Remove old requests
            while (_requestTimes.Count > 0 && _requestTimes.Peek() < oneHourAgo)
            {
                _requestTimes.Dequeue();
            }

            if (_requestTimes.Count >= _maxRequestsPerHour)
            {
                return false; // Rate limit exceeded
            }

            _requestTimes.Enqueue(now);
            return true;
        }
        finally
        {
            _semaphore.Release();
        }
    }
}
```

### Background Services

#### Daily APOD Sync
```csharp
public class ApodSyncBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ApodSyncBackgroundService> _logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var nasaService = scope.ServiceProvider.GetRequiredService<INasaService>();
                
                await SyncTodayApodAsync(nasaService);
                
                // Calculate next run time (6 AM UTC)
                var nextRun = DateTime.UtcNow.Date.AddDays(1).AddHours(6);
                var delay = nextRun - DateTime.UtcNow;
                
                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(delay, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in APOD sync background service");
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }
    }
}
```

## 📊 Monitoramento e Logging

### Structured Logging with Serilog

#### Configuração
```csharp
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "WeatherTrackerAPI")
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .WriteTo.File("logs/weathertracker-.log", 
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .CreateLogger();
```

#### Logging Examples
```csharp
public class NasaService : INasaService
{
    public async Task<ApodDto?> GetApodAsync(DateTime date)
    {
        using var activity = _logger.BeginScope("Getting APOD for {Date}", date);
        
        try
        {
            _logger.LogInformation("Requesting APOD data from NASA API for {Date}", date);
            
            var result = await _httpClient.GetAsync($"?api_key={_apiKey}&date={date:yyyy-MM-dd}");
            
            if (result.IsSuccessStatusCode)
            {
                _logger.LogInformation("Successfully retrieved APOD data for {Date}", date);
                return await ProcessResponse(result);
            }
            
            _logger.LogWarning("NASA API returned {StatusCode} for date {Date}", result.StatusCode, date);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving APOD data for {Date}", date);
            throw;
        }
    }
}
```

### Health Checks

#### Configuration
```csharp
builder.Services.AddHealthChecks()
    .AddDbContext<AppDbContext>()
    .AddCheck<NasaApiHealthCheck>("nasa-api")
    .AddCheck<DatabaseHealthCheck>("database");

// Health check endpoint
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

#### Custom Health Checks
```csharp
public class NasaApiHealthCheck : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("?api_key=DEMO_KEY", cancellationToken);
            
            var data = new Dictionary<string, object>
            {
                ["status_code"] = (int)response.StatusCode,
                ["response_time"] = _stopwatch.ElapsedMilliseconds
            };

            return response.IsSuccessStatusCode 
                ? HealthCheckResult.Healthy("NASA API is available", data)
                : HealthCheckResult.Degraded($"NASA API returned {response.StatusCode}", null, data);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("NASA API is not reachable", ex);
        }
    }
}
```

## 🧪 Estratégia de Testes

### Estrutura de Testes

```
Tests/
├── WeatherTrackerAPI.UnitTests/
│   ├── Controllers/
│   │   ├── AuthControllerTests.cs
│   │   └── NasaControllerTests.cs
│   ├── Services/
│   │   ├── AuthServiceTests.cs
│   │   └── NasaServiceTests.cs
│   └── Repositories/
│       ├── UserRepositoryTests.cs
│       └── ApodRepositoryTests.cs
└── WeatherTrackerAPI.IntegrationTests/
    ├── API/
    │   ├── AuthEndpointsTests.cs
    │   └── NasaEndpointsTests.cs
    └── Database/
        └── RepositoryIntegrationTests.cs
```

### Testes Unitários Example

```csharp
public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IPasswordService> _passwordServiceMock;
    private readonly Mock<IJwtTokenService> _jwtTokenServiceMock;
    private readonly AuthService _authService;

    [Fact]
    public async Task RegisterAsync_WithValidData_ShouldCreateUser()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "Test",
            LastName = "User"
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(registerDto.Email))
            .ReturnsAsync((User?)null);

        _passwordServiceMock
            .Setup(x => x.HashPassword(registerDto.Password))
            .Returns("hashedpassword");

        // Act
        var result = await _authService.RegisterAsync(registerDto);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        _userRepositoryMock.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Once);
    }
}
```

### Testes de Integração

```csharp
public class NasaEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    [Fact]
    public async Task GetApod_WithValidDate_ShouldReturnApodData()
    {
        // Arrange
        var token = await GetValidJwtTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/nasa/apod/2023-12-25");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var apod = JsonSerializer.Deserialize<ApodDto>(content);
        
        apod.Should().NotBeNull();
        apod.Date.Should().Be(new DateTime(2023, 12, 25));
    }
}
```

## 🐳 Docker e DevOps

### Dockerfile

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["WeatherTrackerAPI.csproj", "./"]
RUN dotnet restore "WeatherTrackerAPI.csproj"

# Copy source code and build
COPY . .
RUN dotnet build "WeatherTrackerAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "WeatherTrackerAPI.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 dotnet \
    && adduser --system --uid 1001 --ingroup dotnet dotnet

# Copy published app
COPY --from=publish /app/publish .

# Set ownership and switch to non-root user
RUN chown -R dotnet:dotnet /app
USER dotnet

EXPOSE 8080
EXPOSE 8081

ENTRYPOINT ["dotnet", "WeatherTrackerAPI.dll"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  weathertracker-api:
    build: .
    ports:
      - "8080:8080"
      - "8081:8081"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=WeatherTrackerDB;User Id=sa;Password=YourPassword123!;TrustServerCertificate=true
    depends_on:
      - sqlserver
    networks:
      - weathertracker-network

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
      - MSSQL_PID=Express
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql
    networks:
      - weathertracker-network

volumes:
  sqlserver_data:

networks:
  weathertracker-network:
    driver: bridge
```

### GitHub Actions CI/CD

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '9.0.x'
        
    - name: Restore dependencies
      run: dotnet restore
      
    - name: Build
      run: dotnet build --no-restore --configuration Release
      
    - name: Test
      run: dotnet test --no-build --configuration Release --collect:"XPlat Code Coverage"
      
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        push: true
        tags: weathertracker-api:latest
```

## 📈 Métricas e KPIs

### Métricas de Negócio

- **Usuários Registrados**: Total de usuários na plataforma
- **Consultas Diárias**: Número de requisições para NASA API por dia
- **Taxa de Cache Hit**: Percentual de requisições atendidas pelo cache
- **Dados Sincronizados**: Quantidade de APODs armazenados no banco

### Métricas Técnicas

- **Response Time**: Tempo médio de resposta das APIs
- **Uptime**: Disponibilidade do serviço
- **Error Rate**: Taxa de erros por endpoint
- **Database Performance**: Tempo de execução de queries

### Dashboard Example

```csharp
public class MetricsService
{
    public async Task<DashboardMetrics> GetDashboardMetricsAsync()
    {
        return new DashboardMetrics
        {
            TotalUsers = await _userRepository.CountAsync(),
            TotalApods = await _apodRepository.CountAsync(),
            TodayQueries = await _queryRepository.CountTodayAsync(),
            CacheHitRate = await _cacheService.GetHitRateAsync(),
            AverageResponseTime = await _metricsRepository.GetAverageResponseTimeAsync(),
            SystemUptime = GetSystemUptime()
        };
    }
}
```

Esta especificação técnica detalha todos os aspectos da implementação do WeatherTrackerAPI, garantindo que atenda completamente aos requisitos da avaliação de codificação.
