
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WeatherTrackerAPI.Data;
using WeatherTrackerAPI.Services;
using WeatherTrackerAPI.Repositories;
using WeatherTrackerAPI.Configurations;
using WeatherTrackerAPI.Middleware;
using FluentValidation;
using FluentValidation.AspNetCore;
using AutoMapper;
using WeatherTrackerAPI.Mappings;
using Serilog;
using Pomelo.EntityFrameworkCore.MySql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add Memory Cache
builder.Services.AddMemoryCache();

// Configure Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), 
        new MySqlServerVersion(new Version(8, 0, 35))));

// Configure settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<NasaApiSettings>(builder.Configuration.GetSection("NasaApiSettings"));

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// Configure FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Configure HTTP Client
builder.Services.AddHttpClient<INasaService, NasaService>(client =>
{
    var baseUrl = builder.Configuration["NasaApiSettings:BaseUrl"] ?? "https://api.nasa.gov";
    var timeoutInSeconds = builder.Configuration.GetValue<int>("NasaApiSettings:TimeoutInSeconds", 30);
    
    Console.WriteLine($"[DEBUG] Configuring HttpClient with BaseUrl: {baseUrl}");
    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromSeconds(timeoutInSeconds);
});

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IApodRepository, ApodRepository>();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings?.SecretKey ?? "default-key")),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings?.Issuer ?? "WeatherTrackerAPI",
            ValidateAudience = true,
            ValidAudience = jwtSettings?.Audience ?? "WeatherTrackerAPI-Users",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Weather Tracker API", 
        Version = "v1",
        Description = "API para rastreamento de clima com integração NASA"
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure Health Checks
builder.Services.AddHealthChecks()
    .AddMySql(builder.Configuration.GetConnectionString("DefaultConnection")!);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Weather Tracker API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at apps root
    });
}

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization error: {ex.Message}");
    }
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Add JWT middleware - TEMPORARILY DISABLED FOR TESTING
// app.UseMiddleware<JwtAuthenticationMiddleware>();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
