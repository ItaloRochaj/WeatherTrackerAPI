namespace WeatherTrackerAPI.Configurations;

public class NasaApiSettings
{
    public const string SectionName = "NasaApiSettings";
    
    public string BaseUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public int RateLimitPerHour { get; set; } = 1000;
    public int TimeoutInSeconds { get; set; } = 30;
    public int RetryAttempts { get; set; } = 3;
    public int RetryDelayInSeconds { get; set; } = 5;
}