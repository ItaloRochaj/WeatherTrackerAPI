# Script global para builds e testes do WeatherTrackerAPI
# Execute: .\BuildAndTest.ps1

param(
    [string]$Action = "all"  # "build", "test", "all"
)

$projectRoot = "d:\GitHub\WeatherTrackerAPI"

Write-Host "=== WeatherTrackerAPI - Build e Testes ===" -ForegroundColor Cyan
Write-Host "Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Yellow
Write-Host ""

Push-Location $projectRoot

try {
    if ($Action -eq "build" -or $Action -eq "all") {
        Write-Host "Fazendo build da solução..." -ForegroundColor Blue
        
        # Clean first
        dotnet clean WeatherTrackerAPI.sln --verbosity quiet
        
        # Build solution
        dotnet build WeatherTrackerAPI.sln --verbosity quiet --no-restore
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Build concluído com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "Erro no build!" -ForegroundColor Red
            exit $LASTEXITCODE
        }
        Write-Host ""
    }
    
    if ($Action -eq "test" -or $Action -eq "all") {
        Write-Host "Executando testes..." -ForegroundColor Blue
        
        # Execute tests
        Set-Location "WeatherTrackerAPI.Tests"
        dotnet run --project WeatherTrackerAPI.Tests.csproj --verbosity quiet
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Todos os testes executados com sucesso!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "Erro na execução dos testes!" -ForegroundColor Red
            exit $LASTEXITCODE
        }
    }
}
catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "Processo finalizado com sucesso!" -ForegroundColor Green
