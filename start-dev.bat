@echo off
REM Script PowerShell para iniciar backend e frontend simultaneamente

echo 🚀 Iniciando Backend e Frontend...

REM Mudar para o diretório do backend
cd /d "%~dp0backend"

REM Iniciar backend em background
echo 📦 Iniciando Backend (.NET)...
start /B cmd /c "dotnet run --launch-profile https"

REM Aguardar um pouco para o backend inicializar
timeout /t 5 /nobreak >nul

REM Mudar para o diretório do frontend
cd /d "%~dp0frontendtrackerapi\astronomy-tracker"

REM Iniciar frontend
echo 🌐 Iniciando Frontend (Angular)...
echo ✅ Serviços iniciados!
echo 🔗 Backend: https://localhost:7230
echo 🔗 Frontend: http://localhost:4200
echo.
echo Pressione Ctrl+C para parar o frontend. O backend continuará rodando.
npm start