@echo off
echo --- TATWATS Setup Script ---

echo Creating .env file with placeholder values...

(
    echo GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    echo TATWATS_USERNAME="YOUR_GENERATED_USERNAME"
    echo TATWATS_PASSWORD="YOUR_GENERATED_PASSWORD"
    echo PGHOST=localhost
    echo PGUSER=postgres
    echo PGPASSWORD=your_postgres_password
    echo PGDATABASE=tatwats
    echo PGPORT=5432
) > .env

echo .env file created successfully.
echo.
echo IMPORTANT: Please edit the .env file in your project root with your actual values.
echo.
echo Setup complete.
echo.
echo --- Next Steps ---
echo 1. Ensure Docker Desktop is running.
echo 2. Initialize your database:
echo     npm run db:reset
echo 3. Deploy the application:
echo     deploy.bat
