namespace WeatherTrackerAPI.DTOs
{
    public class ApodDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
        public string? Url { get; set; }
        public string? HdUrl { get; set; }
        public string MediaType { get; set; } = string.Empty;
        public string? Copyright { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ViewCount { get; set; }
        public double? Rating { get; set; }
        public bool IsFavorited { get; set; }
    }

    public class ApodCreateDto
    {
        public DateTime Date { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
        public string? Url { get; set; }
        public string? HdUrl { get; set; }
        public string MediaType { get; set; } = string.Empty;
        public string? Copyright { get; set; }
    }

    public class ApodSummaryDto
    {
        public DateTime Date { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Url { get; set; }
        public string MediaType { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public double? Rating { get; set; }
    }

    public class ApodTrendDto
    {
        public DateTime Period { get; set; }
        public int TotalImages { get; set; }
        public int TotalVideos { get; set; }
        public double AverageRating { get; set; }
        public int TotalViews { get; set; }
        public string MostPopularTitle { get; set; } = string.Empty;
    }
}