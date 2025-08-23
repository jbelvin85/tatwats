@echo off
echo --- TATWATS Debug Script ---
echo This script will start all services in the foreground to display live logs.
echo Press Ctrl+C to stop the services.

:: Ensure we have a clean state before starting
echo.
echo "Ensuring all services are down before starting..."
call shutdown.bat
echo.

:: Check for .env file and run setup if it doesn't exist
if not exist .env (
    echo .env file not found. Running setup...
    call setup.bat
    if %errorlevel% neq 0 (
        echo ERROR: setup.bat failed. Aborting.
        exit /b 1
    )
)

echo Building and starting all services with Docker Compose...
echo You will see logs from all containers below.
docker-compose up --build

echo Services stopped.