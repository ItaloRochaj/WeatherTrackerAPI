using Microsoft.Extensions.Options;
using System.Text.Json;
using WeatherTrackerAPI.Configurations;
using WeatherTrackerAPI.Models;
using WeatherTrackerAPI.DTOs;
using WeatherTrackerAPI.Repositories;
using AutoMapper;
using Microsoft.Extensions.Caching.Memory;

namespace WeatherTrackerAPI.Services
{
    public interface INasaService
    {
        Task<ApodDto> GetApodByDateAsync(DateTime date);
        Task<ApodDto> GetRandomApodAsync();
        Task<IEnumerable<ApodDto>> GetApodRangeAsync(DateTime startDate, DateTime endDate);
        Task<ApodDto> SyncApodFromNasaAsync(DateTime date);
        Task<IEnumerable<ApodDto>> GetStoredApodsAsync(int page = 1, int pageSize = 10);
        Task<IEnumerable<ApodTrendDto>> GetTrendsAsync(DateTime startDate, DateTime endDate);
        Task<ApodDto> IncrementViewCountAsync(Guid id);
        Task<ApodDto> UpdateRatingAsync(Guid id, double rating);
        Task<ApodDto> ToggleFavoriteAsync(Guid id);
    }

    public class NasaService : INasaService
    {
        private readonly HttpClient _httpClient;
        private readonly NasaApiSettings _nasaSettings;
        private readonly IApodRepository _apodRepository;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;
        private readonly ILogger<NasaService> _logger;

        public NasaService(
            HttpClient httpClient,
            IOptions<NasaApiSettings> nasaSettings,
            IApodRepository apodRepository,
            IMapper mapper,
            IMemoryCache cache,
            ILogger<NasaService> logger)
        {
            _httpClient = httpClient;
            _nasaSettings = nasaSettings.Value;
            _apodRepository = apodRepository;
            _mapper = mapper;
            _cache = cache;
            _logger = logger;
        }

        public async Task<ApodDto> GetApodByDateAsync(DateTime date)
        {
            var cacheKey = $"apod_{date:yyyy-MM-dd}";
            
            if (_cache.TryGetValue(cacheKey, out ApodDto? cachedApod) && cachedApod != null)
            {
                return cachedApod;
            }

            var storedApod = await _apodRepository.GetByDateAsync(date);
            if (storedApod != null)
            {
                var dto = _mapper.Map<ApodDto>(storedApod);
                _cache.Set(cacheKey, dto, TimeSpan.FromHours(1));
                return dto;
            }

            return await SyncApodFromNasaAsync(date);
        }

        public async Task<ApodDto> GetRandomApodAsync()
        {
            var random = new Random();
            var startDate = new DateTime(1995, 6, 16);
            var endDate = new DateTime(2024, 8, 29);
            
            var range = (endDate - startDate).Days;
            var randomDays = random.Next(0, range);
            var randomDate = startDate.AddDays(randomDays);

            return await GetApodByDateAsync(randomDate);
        }

        public async Task<IEnumerable<ApodDto>> GetApodRangeAsync(DateTime startDate, DateTime endDate)
        {
            var storedApods = await _apodRepository.GetByDateRangeAsync(startDate, endDate);
            return _mapper.Map<IEnumerable<ApodDto>>(storedApods);
        }

        public async Task<ApodDto> SyncApodFromNasaAsync(DateTime date)
        {
            try
            {
                var url = $"https://api.nasa.gov/planetary/apod?api_key={_nasaSettings.ApiKey}&date={date:yyyy-MM-dd}";
                
                _logger.LogInformation("Fetching APOD from NASA API for date: {Date}", date);
                _logger.LogInformation("Using URL: {Url}", url);
                
                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("NASA API request failed with status: {StatusCode}", response.StatusCode);
                    throw new HttpRequestException($"NASA API request failed: {response.StatusCode}");
                }

                var jsonContent = await response.Content.ReadAsStringAsync();
                var nasaApod = JsonSerializer.Deserialize<ApodResponse>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (nasaApod == null)
                {
                    throw new InvalidOperationException("Failed to deserialize NASA API response");
                }

                var apodEntity = new ApodEntity
                {
                    Date = DateTime.Parse(nasaApod.Date),
                    Title = nasaApod.Title,
                    Explanation = nasaApod.Explanation,
                    Url = nasaApod.Url,
                    HdUrl = nasaApod.HdUrl,
                    MediaType = nasaApod.MediaType,
                    Copyright = nasaApod.Copyright
                };

                var savedApod = await _apodRepository.CreateAsync(apodEntity);
                var dto = _mapper.Map<ApodDto>(savedApod);

                var cacheKey = $"apod_{date:yyyy-MM-dd}";
                _cache.Set(cacheKey, dto, TimeSpan.FromHours(1));

                _logger.LogInformation("APOD synced and stored for date: {Date}", date);
                
                return dto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing APOD from NASA API for date: {Date}", date);
                throw;
            }
        }

        public async Task<IEnumerable<ApodDto>> GetStoredApodsAsync(int page = 1, int pageSize = 10)
        {
            var apods = await _apodRepository.GetAllAsync(page, pageSize);
            return _mapper.Map<IEnumerable<ApodDto>>(apods);
        }

        public async Task<IEnumerable<ApodTrendDto>> GetTrendsAsync(DateTime startDate, DateTime endDate)
        {
            return await _apodRepository.GetTrendsAsync(startDate, endDate);
        }

        public async Task<ApodDto> IncrementViewCountAsync(Guid id)
        {
            var apod = await _apodRepository.IncrementViewCountAsync(id);
            return _mapper.Map<ApodDto>(apod);
        }

        public async Task<ApodDto> UpdateRatingAsync(Guid id, double rating)
        {
            if (rating < 1 || rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5");
            }

            var apod = await _apodRepository.UpdateRatingAsync(id, rating);
            return _mapper.Map<ApodDto>(apod);
        }

        public async Task<ApodDto> ToggleFavoriteAsync(Guid id)
        {
            var apod = await _apodRepository.ToggleFavoriteAsync(id);
            return _mapper.Map<ApodDto>(apod);
        }
    }
}