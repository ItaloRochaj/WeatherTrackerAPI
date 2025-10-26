using System;

namespace WeatherTrackerAPI.DTOs
{
    public class ApodCalendarItemDto
    {
        public DateTime Date { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string PageUrl { get; set; } = string.Empty;
    }
}
