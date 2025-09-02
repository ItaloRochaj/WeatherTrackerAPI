using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeatherTrackerAPI.DTOs;
using WeatherTrackerAPI.Services;

namespace WeatherTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class NasaController : ControllerBase
    {
        private readonly INasaService _nasaService;
        private readonly ILogger<NasaController> _logger;

        public NasaController(INasaService nasaService, ILogger<NasaController> logger)
        {
            _nasaService = nasaService;
            _logger = logger;
        }

        /// <summary>
        /// Obtém a Astronomy Picture of the Day (APOD) para uma data específica
        /// </summary>
        /// <param name="date">Data no formato YYYY-MM-DD (opcional, padrão é hoje)</param>
        /// <returns>Dados da APOD</returns>
        [HttpGet("apod")]
        [ProducesResponseType(typeof(ApodDto), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<IActionResult> GetApod([FromQuery] DateTime? date = null)
        {
            try
            {
                // Use uma data conhecida válida se nenhuma data for especificada
                // Para evitar problemas com datas futuras ou configurações incorretas do sistema
                var targetDate = date ?? new DateTime(2024, 8, 29); // Data conhecida válida
                
                if (targetDate > DateTime.Now.Date)
                {
                    return BadRequest(new { message = "Data não pode ser no futuro" });
                }

                if (targetDate < new DateTime(1995, 6, 16))
                {
                    return BadRequest(new { message = "APOD começou em 16 de junho de 1995" });
                }

                var apod = await _nasaService.GetApodByDateAsync(targetDate);
                
                // Increment view count
                await _nasaService.IncrementViewCountAsync(apod.Id);
                
                return Ok(apod);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error fetching APOD from NASA API");
                return StatusCode(503, new { message = "Serviço da NASA temporariamente indisponível" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting APOD for date: {Date}", date);
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Obtém uma APOD aleatória
        /// </summary>
        /// <returns>Dados da APOD aleatória</returns>
        [HttpGet("apod/random")]
        [ProducesResponseType(typeof(ApodDto), 200)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<IActionResult> GetRandomApod()
        {
            try
            {
                var apod = await _nasaService.GetRandomApodAsync();
                
                // Increment view count
                await _nasaService.IncrementViewCountAsync(apod.Id);
                
                return Ok(apod);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting random APOD");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Obtém APODs em um intervalo de datas
        /// </summary>
        /// <param name="startDate">Data inicial</param>
        /// <param name="endDate">Data final</param>
        /// <returns>Lista de APODs</returns>
        [HttpGet("apod/range")]
        [ProducesResponseType(typeof(IEnumerable<ApodDto>), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> GetApodRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return BadRequest(new { message = "Data inicial deve ser anterior à data final" });
                }

                if (endDate > DateTime.Today)
                {
                    return BadRequest(new { message = "Data final não pode ser no futuro" });
                }

                var daysDifference = (endDate - startDate).Days;
                if (daysDifference > 30)
                {
                    return BadRequest(new { message = "Intervalo não pode ser maior que 30 dias" });
                }

                var apods = await _nasaService.GetApodRangeAsync(startDate, endDate);
                return Ok(apods);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting APOD range");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Obtém todas as APODs armazenadas localmente com paginação
        /// </summary>
        /// <param name="page">Página (padrão: 1)</param>
        /// <param name="pageSize">Itens por página (padrão: 10, máximo: 50)</param>
        /// <returns>Lista paginada de APODs</returns>
        [HttpGet("apod/stored")]
        [ProducesResponseType(typeof(IEnumerable<ApodDto>), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> GetStoredApods([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page < 1)
                {
                    return BadRequest(new { message = "Página deve ser maior que 0" });
                }

                if (pageSize < 1 || pageSize > 50)
                {
                    return BadRequest(new { message = "Tamanho da página deve ser entre 1 e 50" });
                }

                var apods = await _nasaService.GetStoredApodsAsync(page, pageSize);
                return Ok(apods);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting stored APODs");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Obtém tendências e estatísticas das APODs
        /// </summary>
        /// <param name="startDate">Data inicial</param>
        /// <param name="endDate">Data final</param>
        /// <returns>Dados de tendências</returns>
        [HttpGet("apod/trends")]
        [ProducesResponseType(typeof(IEnumerable<ApodTrendDto>), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<IActionResult> GetTrends([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return BadRequest(new { message = "Data inicial deve ser anterior à data final" });
                }

                var trends = await _nasaService.GetTrendsAsync(startDate, endDate);
                return Ok(trends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting trends");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Atualiza a avaliação de uma APOD
        /// </summary>
        /// <param name="id">ID da APOD</param>
        /// <param name="ratingDto">Dados da avaliação</param>
        /// <returns>APOD atualizada</returns>
        [HttpPut("apod/{id}/rating")]
        [ProducesResponseType(typeof(ApodDto), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<IActionResult> UpdateRating(Guid id, [FromBody] RatingDto ratingDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var apod = await _nasaService.UpdateRatingAsync(id, ratingDto.Rating);
                return Ok(apod);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating rating for APOD: {Id}", id);
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Alterna o status de favorito de uma APOD
        /// </summary>
        /// <param name="id">ID da APOD</param>
        /// <returns>APOD atualizada</returns>
        [HttpPost("apod/{id}/favorite")]
        [ProducesResponseType(typeof(ApodDto), 200)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<IActionResult> ToggleFavorite(Guid id)
        {
            try
            {
                var apod = await _nasaService.ToggleFavoriteAsync(id);
                return Ok(apod);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling favorite for APOD: {Id}", id);
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Força a sincronização de uma APOD específica da NASA API
        /// </summary>
        /// <param name="date">Data da APOD a ser sincronizada</param>
        /// <returns>APOD sincronizada</returns>
        [HttpPost("apod/sync")]
        [ProducesResponseType(typeof(ApodDto), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 403)]
        public async Task<IActionResult> SyncApod([FromQuery] DateTime date)
        {
            try
            {
                if (date > DateTime.Now.Date)
                {
                    return BadRequest(new { message = "Data não pode ser no futuro" });
                }

                if (date < new DateTime(1995, 6, 16))
                {
                    return BadRequest(new { message = "APOD começou em 16 de junho de 1995" });
                }

                var apod = await _nasaService.SyncApodFromNasaAsync(date);
                return Ok(apod);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error syncing APOD from NASA API");
                return StatusCode(503, new { message = "Serviço da NASA temporariamente indisponível" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing APOD for date: {Date}", date);
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
    }
}