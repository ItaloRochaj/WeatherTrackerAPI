#!/bin/bash

echo "=== Astronomy Tracker - Start Script ==="
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "Checking dependencies..."

if ! command_exists dotnet; then
    echo "❌ .NET SDK not found. Please install .NET 8 SDK"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm not found. Please install Node.js and npm"
    exit 1
fi

echo "✅ Dependencies OK"
echo ""

# Start backend in background
echo "🚀 Starting Backend..."
cd backend
start dotnet run --project WeatherTrackerAPI.csproj --launch-profile https
cd ..

# Wait a bit for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start frontend
echo "🎨 Starting Frontend..."
cd frontendtrackerapi/astronomy-tracker

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

npm start

echo ""
echo "🎉 Application started!"
echo "Frontend: http://localhost:4200"
echo "Backend: https://localhost:7230"
echo ""
echo "Press Ctrl+C to stop both servers"