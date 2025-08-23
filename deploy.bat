@echo off
echo --- TATWATS Deploy Script ---

:: Check for .env file and run setup if it doesn't exist
if not exist .env (
    echo Error: .env file not found. Please run the setup script first:
    echo     setup.bat
    exit /b 1
)

echo Stopping any currently running services to ensure a clean state...
docker-compose down

echo Building and starting all services with Docker Compose...
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo Error: Failed to start services with Docker Compose.
    exit /b 1
)
echo All services started.

echo Deployment complete. Access the application at http://localhost:3000 (frontend) and http://localhost:3001 (backend API).
echo To stop all services, run the shutdown script.
