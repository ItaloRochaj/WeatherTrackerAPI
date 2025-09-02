using AutoMapper;
using WeatherTrackerAPI.Models;
using WeatherTrackerAPI.DTOs;

namespace WeatherTrackerAPI.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User mappings
            CreateMap<User, RegisterResponseDto>();
            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => "User"));

            // APOD mappings
            CreateMap<ApodEntity, ApodDto>();
            CreateMap<ApodDto, ApodEntity>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            CreateMap<ApodCreateDto, ApodEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.ViewCount, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.IsFavorited, opt => opt.MapFrom(src => false));

            CreateMap<ApodEntity, ApodSummaryDto>();

            // NASA API Response to Entity mapping
            CreateMap<ApodResponse, ApodEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.Parse(src.Date)))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.ViewCount, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.Rating, opt => opt.Ignore())
                .ForMember(dest => dest.IsFavorited, opt => opt.MapFrom(src => false));
        }
    }
}