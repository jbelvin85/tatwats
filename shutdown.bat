@echo off
echo --- TATWATS Shutdown Script ---

echo Stopping all services with Docker Compose...
docker-compose down
if %errorlevel% neq 0 (
    echo Error: Failed to stop services with Docker Compose.
)
echo All services stopped.

echo Shutdown complete.
