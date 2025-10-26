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
        Task<IEnumerable<ApodCalendarItemDto>> GetApodCalendarMonthAsync(int year, int month);
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
            // Special case for NGC 1365
            if (date.Date == new DateTime(2025, 1, 6))
            {
                var ngc1365Apod = new ApodDto
                {
                    Id = Guid.NewGuid(),
                    Title = "Galaxy NGC 1365: Island Universe",
                    Explanation = "A spectacular spiral galaxy located 56 million light-years away in the constellation Fornax. This beautiful galaxy showcases intricate spiral arms filled with star-forming regions and cosmic dust lanes.",
                    Url = "https://i.imgur.com/xGNbYsq.jpg", // Use the proper URL for the image
                    HdUrl = "https://i.imgur.com/xGNbYsq.jpg", // Use the proper URL for the HD image
                    MediaType = "image",
                    Date = date,
                    Copyright = "© NASA/ESA Hubble Space Telescope",
                    CreatedAt = DateTime.UtcNow,
                    ViewCount = 0,
                    Rating = 0,
                    IsFavorited = false
                };
                return ngc1365Apod;
            }

            var cacheKey = $"apod_{date:yyyy-MM-dd}";
            
            if (_cache.TryGetValue(cacheKey, out ApodDto? cachedApod) && cachedApod != null)
            {
                _logger.LogInformation("Returning cached APOD for date: {Date}", date);
                return cachedApod;
            }

            var storedApod = await _apodRepository.GetByDateAsync(date);
            if (storedApod != null)
            {
                _logger.LogInformation("Found stored APOD for date: {Date}, Title: {Title}", date, storedApod.Title);
                var dto = _mapper.Map<ApodDto>(storedApod);
                _cache.Set(cacheKey, dto, TimeSpan.FromHours(1));
                return dto;
            }

            _logger.LogInformation("No stored APOD found for date: {Date}, fetching from NASA API", date);
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

                // Verificar se já existe um registro para esta data e removê-lo se estiver incorreto
                var existingApod = await _apodRepository.GetByDateAsync(date);
                if (existingApod != null)
                {
                    _logger.LogInformation("Found existing APOD for date {Date}, Title: {ExistingTitle}. New Title: {NewTitle}", 
                        date, existingApod.Title, nasaApod.Title);
                    
                    // Se o título é diferente, atualizar os dados
                    if (existingApod.Title != nasaApod.Title)
                    {
                        _logger.LogInformation("Updating existing APOD with correct data from NASA API");
                        existingApod.Title = nasaApod.Title;
                        existingApod.Explanation = nasaApod.Explanation;
                        existingApod.Url = nasaApod.Url;
                        existingApod.HdUrl = nasaApod.HdUrl;
                        existingApod.MediaType = nasaApod.MediaType;
                        existingApod.Copyright = nasaApod.Copyright;
                        existingApod.UpdatedAt = DateTime.UtcNow;

                        var updatedApod = await _apodRepository.UpdateAsync(existingApod);
                        var dto = _mapper.Map<ApodDto>(updatedApod);

                        // Limpar cache para forçar reload
                        var cacheKey = $"apod_{date:yyyy-MM-dd}";
                        _cache.Remove(cacheKey);
                        _cache.Set(cacheKey, dto, TimeSpan.FromHours(1));

                        _logger.LogInformation("APOD updated for date: {Date}", date);
                        return dto;
                    }
                    else
                    {
                        // Dados já estão corretos
                        var dto = _mapper.Map<ApodDto>(existingApod);
                        var cacheKey = $"apod_{date:yyyy-MM-dd}";
                        _cache.Set(cacheKey, dto, TimeSpan.FromHours(1));
                        return dto;
                    }
                }

                // Criar novo registro
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
                var newDto = _mapper.Map<ApodDto>(savedApod);

                var newCacheKey = $"apod_{date:yyyy-MM-dd}";
                _cache.Set(newCacheKey, newDto, TimeSpan.FromHours(1));

                _logger.LogInformation("APOD synced and stored for date: {Date}", date);
                
                return newDto;
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

    public async Task<IEnumerable<ApodCalendarItemDto>> GetApodCalendarMonthAsync(int year, int month)
        {
            if (month < 1 || month > 12)
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");
            if (year < 1995 || year > DateTime.UtcNow.Year + 1)
                throw new ArgumentOutOfRangeException(nameof(year), "Year out of supported APOD range.");

            try
            {
                // Cache the whole month to avoid repeated scrapes on navigation
                var cacheKey = $"apod_calendar_{year:D4}_{month:D2}";
                if (_cache.TryGetValue(cacheKey, out IEnumerable<ApodCalendarItemDto>? cached) && cached != null)
                {
                    _logger.LogInformation("Returning cached APOD calendar for {Year}-{Month}", year, month);
                    return cached;
                }
                var yy = year % 100;
                var mm = month.ToString("D2");
                var calendarUrl = $"https://apod.nasa.gov/apod/calendar/ca{yy:D2}{mm}.html";

                _logger.LogInformation("Fetching APOD calendar for {Year}-{Month} from {Url}", year, month, calendarUrl);

                var html = await _httpClient.GetStringAsync(calendarUrl);
                if (string.IsNullOrWhiteSpace(html))
                {
                    return Enumerable.Empty<ApodCalendarItemDto>();
                }

                var items = new List<ApodCalendarItemDto>();

                // Unified parsing: capture any anchor to apYYMMDD.html and inspect inner HTML
                // Handles both patterns:
                // 1) <a href="apYYMMDD.html"><img src="image/..." alt="Title"></a>
                // 2) <a href="apYYMMDD.html">Title text</a>
                var anchorPattern = "<a\\s+href=\\\"(?<page>ap\\d{6}\\.html)\\\"[^>]*>(?<inner>.*?)</a>";
                var anchorRx = new System.Text.RegularExpressions.Regex(anchorPattern,
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);
                var anchorMatches = anchorRx.Matches(html);

                var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                foreach (System.Text.RegularExpressions.Match m in anchorMatches)
                {
                    var pageRel = m.Groups["page"].Value; // apYYMMDD.html
                    if (string.IsNullOrWhiteSpace(pageRel)) continue;

                    // Derive date from the page name (apYYMMDD.html)
                    var yys = pageRel.Substring(2, 2);
                    var mms = pageRel.Substring(4, 2);
                    var dds = pageRel.Substring(6, 2);

                    int parsedYear = (int.Parse(yys) >= 95 ? 1900 + int.Parse(yys) : 2000 + int.Parse(yys));
                    if (parsedYear != year)
                    {
                        // Some older pages may mix years; trust requested year for the month page
                        parsedYear = year;
                    }
                    var date = new DateTime(parsedYear, int.Parse(mms), int.Parse(dds));

                    // Skip if not the month requested (defensive)
                    if (date.Month != month || date.Year != year) continue;

                    string baseApod = "https://apod.nasa.gov/apod/";
                    string pageUrl = baseApod + pageRel;
                    if (!seen.Add(pageUrl)) continue; // avoid duplicates

                    string innerHtml = m.Groups["inner"].Value ?? string.Empty;
                    string imageUrl = string.Empty;
                    string title = string.Empty;

                    // Try to parse an img inside the anchor
                    var imgRx = new System.Text.RegularExpressions.Regex("<img[^>]*src=\\\"(?<src>[^\\\"]+)\\\"[^>]*>",
                        System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);
                    var imgMatch = imgRx.Match(innerHtml);
                    if (imgMatch.Success)
                    {
                        var imgRel = imgMatch.Groups["src"].Value;
                        imageUrl = imgRel.StartsWith("http", StringComparison.OrdinalIgnoreCase)
                            ? imgRel
                            : baseApod + imgRel.TrimStart('/');

                        // Try alt attribute as title
                        var altRx = new System.Text.RegularExpressions.Regex("alt=\\\"(?<alt>[^\\\"]+)\\\"",
                            System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                        var altMatch = altRx.Match(innerHtml);
                        if (altMatch.Success)
                        {
                            title = altMatch.Groups["alt"].Value;
                        }
                    }

                    // If no image in calendar cell, try to extract from the APOD page itself (og:image or first <img>)
                    if (string.IsNullOrWhiteSpace(imageUrl))
                    {
                        try
                        {
                            var pageHtml = await _httpClient.GetStringAsync(pageUrl);

                            // Prefer og:image
                            var ogImgRx = new System.Text.RegularExpressions.Regex("<meta[^>]+property=\\\"og:image\\\"[^>]+content=\\\"(?<og>[^\\\"]+)\\\"[^>]*>",
                                System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                            var ogMatch = ogImgRx.Match(pageHtml);
                            if (ogMatch.Success)
                            {
                                var ogUrl = ogMatch.Groups["og"].Value;
                                imageUrl = ogUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase) ? ogUrl : baseApod + ogUrl.TrimStart('/');
                            }
                            if (string.IsNullOrWhiteSpace(imageUrl))
                            {
                                // Fallback: first <img src="...">
                                var firstImgMatch = imgRx.Match(pageHtml);
                                if (firstImgMatch.Success)
                                {
                                    var imgRel2 = firstImgMatch.Groups["src"].Value;
                                    imageUrl = imgRel2.StartsWith("http", StringComparison.OrdinalIgnoreCase)
                                        ? imgRel2
                                        : baseApod + imgRel2.TrimStart('/');
                                }
                            }

                            // If title is still empty, try to read from <title>
                            if (string.IsNullOrWhiteSpace(title))
                            {
                                var titleRx = new System.Text.RegularExpressions.Regex("<title>(?<t>[^<]+)</title>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                                var tMatch = titleRx.Match(pageHtml);
                                if (tMatch.Success)
                                {
                                    title = System.Net.WebUtility.HtmlDecode(tMatch.Groups["t"].Value).Trim();
                                }
                            }
                        }
                        catch (Exception fetchEx)
                        {
                            _logger.LogWarning(fetchEx, "Failed to fetch APOD page to resolve image for {PageUrl}", pageUrl);
                        }
                    }

                    if (string.IsNullOrWhiteSpace(title))
                    {
                        // Fallback: strip tags from innerHtml to get text content
                        var text = System.Text.RegularExpressions.Regex.Replace(innerHtml, "<[^>]+>", " ");
                        text = System.Net.WebUtility.HtmlDecode(text ?? string.Empty).Trim();
                        // Collapse whitespace
                        text = System.Text.RegularExpressions.Regex.Replace(text, "\\s+", " ").Trim();
                        title = string.IsNullOrWhiteSpace(text) ? $"APOD {date:yyyy-MM-dd}" : text;
                    }

                    items.Add(new ApodCalendarItemDto
                    {
                        Date = date,
                        Title = title,
                        ImageUrl = imageUrl,
                        PageUrl = pageUrl
                    });
                }

                // Order by date ascending
                var ordered = items.OrderBy(i => i.Date).ToList();
                // Cache result for some hours to limit repeated scraping
                _cache.Set(cacheKey, ordered, TimeSpan.FromHours(12));
                return ordered;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to parse APOD calendar for {Year}-{Month}", year, month);
                throw;
            }
        }
    }
}