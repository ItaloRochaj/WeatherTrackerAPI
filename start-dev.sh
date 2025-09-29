#!/bin/bash

# Script para iniciar backend e frontend simultaneamente

echo "🚀 Iniciando Backend e Frontend..."

# Função para cleanup
cleanup() {
    echo "🛑 Parando serviços..."
    pkill -f "dotnet run"
    pkill -f "ng serve"
    exit 0
}

# Trap para cleanup ao sair
trap cleanup SIGINT SIGTERM

# Diretório base do projeto
PROJECT_ROOT="$(dirname "$(realpath "$0")")"

# Iniciar backend em background
echo "📦 Iniciando Backend (.NET)..."
cd "$PROJECT_ROOT/backend"
dotnet run --launch-profile https &
BACKEND_PID=$!

# Aguardar um pouco para o backend inicializar
sleep 5

# Iniciar frontend em background
echo "🌐 Iniciando Frontend (Angular)..."
cd "$PROJECT_ROOT/frontendtrackerapi/astronomy-tracker"
npm start &
FRONTEND_PID=$!

echo "✅ Serviços iniciados!"
echo "🔗 Backend: https://localhost:7230"
echo "🔗 Frontend: http://localhost:4200"
echo ""
echo "Pressione Ctrl+C para parar ambos os serviços"

# Aguardar indefinidamente
wait