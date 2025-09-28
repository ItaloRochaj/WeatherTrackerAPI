# NASA API Integration Guide

## 📡 NASA API Overview

O projeto WeatherTrackerAPI utiliza a **NASA Astronomy Picture of the Day (APOD) API** para coletar dados astronômicos diários e históricos.

### 🔑 Informações da API

- **Base URL**: `https://api.nasa.gov/planetary/apod`
- **API Key**: `zR5OaEYqLP8dUuP3TjgJBz7PsVYKQaWOhhbqKgjd`
- **Rate Limit**: 1.000 requests/hora
- **Documentação**: [NASA Open Data Portal](https://api.nasa.gov/)

## 📋 Endpoints Disponíveis

### 1. APOD Atual
```http
GET https://api.nasa.gov/planetary/apod?api_key={API_KEY}
```

### 2. APOD por Data Específica
```http
GET https://api.nasa.gov/planetary/apod?api_key={API_KEY}&date=2023-12-25
```

### 3. Intervalo de Datas
```http
GET https://api.nasa.gov/planetary/apod?api_key={API_KEY}&start_date=2023-12-01&end_date=2023-12-31
```

### 4. Contagem Aleatória
```http
GET https://api.nasa.gov/planetary/apod?api_key={API_KEY}&count=10
```

## 📊 Estrutura de Resposta

```json
{
  "date": "2023-12-25",
  "explanation": "Descrição detalhada da imagem astronômica...",
  "hdurl": "https://apod.nasa.gov/apod/image/2312/example_hd.jpg",
  "media_type": "image",
  "service_version": "v1",
  "title": "Título da Imagem Astronômica",
  "url": "https://apod.nasa.gov/apod/image/2312/example.jpg",
  "copyright": "Nome do Fotógrafo/Instituição"
}
```

### Campos Opcionais
- `copyright`: Presente apenas quando a imagem tem direitos autorais
- `hdurl`: URL da versão HD (nem sempre disponível)

## 🛠️ Implementação no Projeto

### 1. Modelo de Response (ApodResponse.cs)
```csharp
public class ApodResponse
{
    [JsonPropertyName("date")]
    public string Date { get; set; }

    [JsonPropertyName("explanation")]
    public string Explanation { get; set; }

    [JsonPropertyName("hdurl")]
    public string? HdUrl { get; set; }

    [JsonPropertyName("media_type")]
    public string MediaType { get; set; }

    [JsonPropertyName("service_version")]
    public string ServiceVersion { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("url")]
    public string Url { get; set; }

    [JsonPropertyName("copyright")]
    public string? Copyright { get; set; }
}
```

### 2. Entidade para Persistência (ApodEntity.cs)
```csharp
public class ApodEntity
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? HdUrl { get; set; }
    public string MediaType { get; set; } = "image";
    public string? Copyright { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### 3. DTO para API Response (ApodDto.cs)
```csharp
public class ApodDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? HdUrl { get; set; }
    public string MediaType { get; set; } = "image";
    public string? Copyright { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

## 🔧 Configuração do HttpClient

### Registro no Program.cs
```csharp
builder.Services.AddHttpClient<INasaService, NasaService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["NasaApiSettings:BaseUrl"]);
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "WeatherTrackerAPI/1.0");
});
```

### Implementação do Serviço
```csharp
public class NasaService : INasaService
{
    private readonly HttpClient _httpClient;
    private readonly NasaApiSettings _settings;
    private readonly ILogger<NasaService> _logger;

    public async Task<ApodResponse?> GetApodAsync(DateTime? date = null)
    {
        var queryString = $"?api_key={_settings.ApiKey}";
        
        if (date.HasValue)
        {
            queryString += $"&date={date.Value:yyyy-MM-dd}";
        }

        try
        {
            var response = await _httpClient.GetAsync(queryString);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<ApodResponse>(content);
            }
            
            _logger.LogWarning("NASA API returned {StatusCode}", response.StatusCode);
            return null;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error calling NASA API");
            return null;
        }
    }
}
```

## 🚦 Rate Limiting e Boas Práticas

### 1. Implementação de Rate Limiting
```csharp
public class NasaRateLimitService
{
    private readonly IMemoryCache _cache;
    private readonly int _requestsPerHour;

    public async Task<bool> CanMakeRequestAsync()
    {
        var key = "nasa_api_requests";
        var requests = _cache.Get<List<DateTime>>(key) ?? new List<DateTime>();
        
        // Remove requests older than 1 hour
        requests.RemoveAll(r => r < DateTime.UtcNow.AddHours(-1));
        
        if (requests.Count >= _requestsPerHour)
        {
            return false;
        }
        
        requests.Add(DateTime.UtcNow);
        _cache.Set(key, requests, TimeSpan.FromHours(1));
        
        return true;
    }
}
```

### 2. Cache de Responses
```csharp
public async Task<ApodDto?> GetApodWithCacheAsync(DateTime date)
{
    var cacheKey = $"apod_{date:yyyy-MM-dd}";
    
    if (_cache.TryGetValue<ApodDto>(cacheKey, out var cachedApod))
    {
        return cachedApod;
    }
    
    var apodResponse = await GetApodAsync(date);
    if (apodResponse != null)
    {
        var apodDto = _mapper.Map<ApodDto>(apodResponse);
        _cache.Set(cacheKey, apodDto, TimeSpan.FromHours(24));
        return apodDto;
    }
    
    return null;
}
```

## 📅 Estratégias de Sincronização

### 1. Sincronização Inicial
```csharp
public async Task SyncHistoricalDataAsync(DateTime startDate, DateTime endDate)
{
    var currentDate = startDate;
    var batchSize = 10;
    var batch = new List<DateTime>();

    while (currentDate <= endDate)
    {
        batch.Add(currentDate);
        
        if (batch.Count >= batchSize)
        {
            await ProcessBatchAsync(batch);
            batch.Clear();
            
            // Delay to respect rate limits
            await Task.Delay(TimeSpan.FromSeconds(1));
        }
        
        currentDate = currentDate.AddDays(1);
    }

    if (batch.Any())
    {
        await ProcessBatchAsync(batch);
    }
}
```

### 2. Sincronização Diária (Background Service)
```csharp
public class ApodSyncService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await SyncTodayApodAsync();
                
                // Wait until next day
                var nextRun = DateTime.Today.AddDays(1).AddHours(6); // 6 AM
                var delay = nextRun - DateTime.Now;
                
                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(delay, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in APOD sync service");
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }
    }
}
```

## 🔍 Tratamento de Erros

### Cenários Comuns de Erro

1. **Rate Limit Exceeded (429)**
```csharp
if (response.StatusCode == HttpStatusCode.TooManyRequests)
{
    var retryAfter = response.Headers.RetryAfter?.Delta ?? TimeSpan.FromMinutes(60);
    _logger.LogWarning("Rate limit exceeded. Retry after: {RetryAfter}", retryAfter);
    throw new RateLimitExceededException(retryAfter);
}
```

2. **Data não encontrada (404)**
```csharp
if (response.StatusCode == HttpStatusCode.NotFound)
{
    _logger.LogInformation("APOD not found for date: {Date}", date);
    return null;
}
```

3. **API Temporariamente Indisponível (503)**
```csharp
if (response.StatusCode == HttpStatusCode.ServiceUnavailable)
{
    _logger.LogWarning("NASA API temporarily unavailable");
    throw new ExternalServiceUnavailableException("NASA API is temporarily unavailable");
}
```

## 📈 Métricas e Monitoramento

### 1. Métricas de API
```csharp
public class NasaApiMetrics
{
    public int TotalRequests { get; set; }
    public int SuccessfulRequests { get; set; }
    public int FailedRequests { get; set; }
    public TimeSpan AverageResponseTime { get; set; }
    public DateTime LastSuccessfulRequest { get; set; }
    public int RateLimitHits { get; set; }
}
```

### 2. Health Check
```csharp
public class NasaApiHealthCheck : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var canMakeRequest = await _rateLimitService.CanMakeRequestAsync();
            if (!canMakeRequest)
            {
                return HealthCheckResult.Degraded("Rate limit reached");
            }

            var response = await _httpClient.GetAsync("?api_key=DEMO_KEY", cancellationToken);
            
            return response.IsSuccessStatusCode 
                ? HealthCheckResult.Healthy("NASA API is available")
                : HealthCheckResult.Unhealthy($"NASA API returned {response.StatusCode}");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("NASA API is not reachable", ex);
        }
    }
}
```

## 🎯 Casos de Uso Implementados

### 1. Buscar APOD do Dia
- **Endpoint**: `GET /api/nasa/apod`
- **Descrição**: Retorna a imagem astronômica do dia atual
- **Cache**: 24 horas

### 2. Buscar APOD por Data
- **Endpoint**: `GET /api/nasa/apod/{date}`
- **Descrição**: Retorna APOD de uma data específica
- **Validação**: Data não pode ser futura

### 3. Buscar APOD por Período
- **Endpoint**: `GET /api/nasa/apod/range?start={start}&end={end}`
- **Descrição**: Retorna APODs de um período
- **Limite**: Máximo 100 dias

### 4. Sincronizar Dados
- **Endpoint**: `POST /api/nasa/sync`
- **Descrição**: Força sincronização de dados históricos
- **Autorização**: Apenas administradores

### 5. Estatísticas
- **Endpoint**: `GET /api/nasa/statistics`
- **Descrição**: Estatísticas de uso da API NASA
- **Métricas**: Total de requests, cache hits, etc.

## 🔗 Links Úteis

- [NASA Open Data Portal](https://api.nasa.gov/)
- [APOD Archive](https://apod.nasa.gov/apod/archivepix.html)
- [NASA API GitHub](https://github.com/nasa/apod-api)
- [Rate Limiting Best Practices](https://docs.microsoft.com/en-us/azure/architecture/patterns/rate-limiting-pattern)
