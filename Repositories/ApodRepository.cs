using Microsoft.EntityFrameworkCore;
using WeatherTrackerAPI.Data;
using WeatherTrackerAPI.Models;
using WeatherTrackerAPI.DTOs;

namespace WeatherTrackerAPI.Repositories
{
    public interface IApodRepository
    {
        Task<ApodEntity?> GetByDateAsync(DateTime date);
        Task<ApodEntity?> GetByIdAsync(Guid id);
        Task<ApodEntity> CreateAsync(ApodEntity apod);
        Task<ApodEntity> UpdateAsync(ApodEntity apod);
        Task<bool> ExistsByDateAsync(DateTime date);
        Task<IEnumerable<ApodEntity>> GetAllAsync(int page = 1, int pageSize = 10);
        Task<IEnumerable<ApodEntity>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<ApodEntity> IncrementViewCountAsync(Guid id);
        Task<ApodEntity> UpdateRatingAsync(Guid id, double rating);
        Task<ApodEntity> ToggleFavoriteAsync(Guid id);
        Task<IEnumerable<ApodTrendDto>> GetTrendsAsync(DateTime startDate, DateTime endDate);
        Task<int> GetTotalCountAsync();
    }

    public class ApodRepository : IApodRepository
    {
        private readonly AppDbContext _context;

        public ApodRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ApodEntity?> GetByDateAsync(DateTime date)
        {
            return await _context.ApodData
                .FirstOrDefaultAsync(a => a.Date.Date == date.Date);
        }

        public async Task<ApodEntity?> GetByIdAsync(Guid id)
        {
            return await _context.ApodData
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<ApodEntity> CreateAsync(ApodEntity apod)
        {
            _context.ApodData.Add(apod);
            await _context.SaveChangesAsync();
            return apod;
        }

        public async Task<ApodEntity> UpdateAsync(ApodEntity apod)
        {
            apod.UpdatedAt = DateTime.UtcNow;
            _context.ApodData.Update(apod);
            await _context.SaveChangesAsync();
            return apod;
        }

        public async Task<bool> ExistsByDateAsync(DateTime date)
        {
            return await _context.ApodData
                .AnyAsync(a => a.Date.Date == date.Date);
        }

        public async Task<IEnumerable<ApodEntity>> GetAllAsync(int page = 1, int pageSize = 10)
        {
            return await _context.ApodData
                .OrderByDescending(a => a.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<ApodEntity>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.ApodData
                .Where(a => a.Date.Date >= startDate.Date && a.Date.Date <= endDate.Date)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        public async Task<ApodEntity> IncrementViewCountAsync(Guid id)
        {
            var apod = await GetByIdAsync(id);
            if (apod != null)
            {
                apod.ViewCount++;
                await UpdateAsync(apod);
            }
            return apod!;
        }

        public async Task<ApodEntity> UpdateRatingAsync(Guid id, double rating)
        {
            var apod = await GetByIdAsync(id);
            if (apod != null)
            {
                apod.Rating = rating;
                await UpdateAsync(apod);
            }
            return apod!;
        }

        public async Task<ApodEntity> ToggleFavoriteAsync(Guid id)
        {
            var apod = await GetByIdAsync(id);
            if (apod != null)
            {
                apod.IsFavorited = !apod.IsFavorited;
                await UpdateAsync(apod);
            }
            return apod!;
        }

        public async Task<IEnumerable<ApodTrendDto>> GetTrendsAsync(DateTime startDate, DateTime endDate)
        {
            var data = await _context.ApodData
                .Where(a => a.Date >= startDate && a.Date <= endDate)
                .ToListAsync();

            var trends = data
                .GroupBy(a => new { Year = a.Date.Year, Month = a.Date.Month })
                .Select(g => new ApodTrendDto
                {
                    Period = new DateTime(g.Key.Year, g.Key.Month, 1),
                    TotalImages = g.Count(x => x.MediaType == "image"),
                    TotalVideos = g.Count(x => x.MediaType == "video"),
                    AverageRating = g.Where(x => x.Rating.HasValue).Average(x => x.Rating) ?? 0,
                    TotalViews = g.Sum(x => x.ViewCount),
                    MostPopularTitle = g.OrderByDescending(x => x.ViewCount).FirstOrDefault()?.Title ?? "N/A"
                })
                .OrderByDescending(t => t.Period)
                .ToList();

            return trends;
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _context.ApodData.CountAsync();
        }
    }
}