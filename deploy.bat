@echo off
echo --- TATWATS Deploy Script ---

echo Running shutdown script to ensure a clean state...
call shutdown.bat
if %errorlevel% neq 0 (
    echo Warning: Shutdown script encountered an error, but proceeding with deployment.
)

:: Check for .env file and run setup if it doesn't exist
if not exist .env (
    echo .env file not found. Running setup...
    call setup.bat
)

:: Load environment variables from .env file
if exist .env (
    for /f "tokens=*" %%i in (.env) do (
        set "%%i"
    )
    echo Environment variables loaded from .env
) else (
    echo ERROR: .env file not found and setup failed.
    exit /b 1
)

echo Building and starting all services with Docker Compose...
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo Error: Failed to start services with Docker Compose.
    exit /b 1
)
echo All services started.

echo Deployment complete. Access the application at http://localhost:3000 (frontend) and http://localhost:3001 (backend API).
echo To stop all services, run the shutdown script.
