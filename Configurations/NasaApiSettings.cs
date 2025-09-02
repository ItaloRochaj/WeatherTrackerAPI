namespace WeatherTrackerAPI.Configurations
{
    public class NasaApiSettings
    {
        public const string SectionName = "NasaApi";
        
        public string BaseUrl { get; set; } = "https://api.nasa.gov/";
        public string ApiKey { get; set; } = string.Empty;
        public int RateLimitPerHour { get; set; } = 1000;
        public int TimeoutInSeconds { get; set; } = 30;
        public int RetryAttempts { get; set; } = 3;
        public int RetryDelayInSeconds { get; set; } = 5;
    }
}