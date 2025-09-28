# Script para executar testes do WeatherTrackerAPI
# Inclui build para verificação de erros antes dos testes

Write-Host "=== WeatherTrackerAPI - Executando Suite de Testes ===" -ForegroundColor Green
Write-Host "Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Yellow
Write-Host ""

# Navegar para o diretório correto
Push-Location "$PSScriptRoot"

try {
    # Primeiro fazer build para verificar erros
    Write-Host "Verificando build do projeto..." -ForegroundColor Cyan
    Set-Location ".."
    dotnet build WeatherTrackerAPI.sln --verbosity quiet
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro no build! Corrija os erros antes de executar os testes." -ForegroundColor Red
        exit $LASTEXITCODE
    }
    
    Write-Host "Build OK. Iniciando execução dos testes..." -ForegroundColor Cyan
    Set-Location "WeatherTrackerAPI.Tests"
    Write-Host ""
    
    # Executar o projeto de testes
    dotnet run --project WeatherTrackerAPI.Tests.csproj --verbosity quiet
    
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "Todos os testes executados com sucesso!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Erro na execução dos testes!" -ForegroundColor Red
        exit $exitCode
    }
}
catch {
    Write-Host "Erro ao executar testes: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "Script finalizado." -ForegroundColor Green
