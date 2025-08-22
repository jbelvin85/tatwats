@echo off
echo --- TATWATS Setup Script ---

:: Check for Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Compose not found. Please install Docker Desktop (which includes Docker Compose) or Docker Engine with Compose plugin.
    echo See: https://docs.docker.com/compose/install/
    exit /b 1
)

echo Docker Compose found. Proceeding with setup.

:: Initialize variables with defaults from .env.example
set "GEMINI_API_KEY_VAR=YOUR_GEMINI_API_KEY_HERE"
set "TATWATS_USERNAME_VAR=YOUR_GENERATED_USERNAME"
set "TATWATS_PASSWORD_VAR=YOUR_GENERATED_PASSWORD"
set "PGHOST_VAR=localhost"
set "PGUSER_VAR=postgres"
set "PGPASSWORD_VAR=your_postgres_password"
set "PGDATABASE_VAR=tatwats"
set "PGPORT_VAR=5432"

echo.
echo --- Environment Variable Configuration ---
echo Please provide values for the following environment variables.
echo Press Enter to accept the default value in parentheses.

set /p "GEMINI_API_KEY_VAR=Enter your Gemini API Key (default: %GEMINI_API_KEY_VAR%): "
if not defined GEMINI_API_KEY_VAR set "GEMINI_API_KEY_VAR=YOUR_GEMINI_API_KEY_HERE"

set /p "TATWATS_USERNAME_VAR=Enter Tatwats Username (default: %TATWATS_USERNAME_VAR%): "
if not defined TATWATS_USERNAME_VAR set "TATWATS_USERNAME_VAR=YOUR_GENERATED_USERNAME"

set /p "TATWATS_PASSWORD_VAR=Enter Tatwats Password (default: %TATWATS_PASSWORD_VAR%): "
if not defined TATWATS_PASSWORD_VAR set "TATWATS_PASSWORD_VAR=YOUR_GENERATED_PASSWORD"

set /p "PGHOST_VAR=Enter PostgreSQL Host (default: %PGHOST_VAR%): "
if not defined PGHOST_VAR set "PGHOST_VAR=localhost"

set /p "PGUSER_VAR=Enter PostgreSQL User (default: %PGUSER_VAR%): "
if not defined PGUSER_VAR set "PGUSER_VAR=postgres"

set /p "PGPASSWORD_VAR=Enter PostgreSQL Password (default: %PGPASSWORD_VAR%): "
if not defined PGPASSWORD_VAR set "PGPASSWORD_VAR=your_postgres_password"

set /p "PGDATABASE_VAR=Enter PostgreSQL Database Name (default: %PGDATABASE_VAR%): "
if not defined PGDATABASE_VAR set "PGDATABASE_VAR=tatwats"

set /p "PGPORT_VAR=Enter PostgreSQL Port (default: %PGPORT_VAR%): "
if not defined PGPORT_VAR set "PGPORT_VAR=5432"

echo Creating .env file...
(
    echo GEMINI_API_KEY="%GEMINI_API_KEY_VAR%"
    echo TATWATS_USERNAME="%TATWATS_USERNAME_VAR%"
    echo TATWATS_PASSWORD="%TATWATS_PASSWORD_VAR%"
    echo PGHOST=%PGHOST_VAR%
    echo PGUSER=%PGUSER_VAR%
    echo PGPASSWORD=%PGPASSWORD_VAR%
    echo PGDATABASE=%PGDATABASE_VAR%
    echo PGPORT=%PGPORT_VAR%
) > .env

echo .env file created successfully.
echo Setup complete. You can now run the deploy script.
