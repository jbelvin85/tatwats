@echo off

echo Stopping Tatwats Server and Client...

REM Find and kill the server process by window title
taskkill /FI "WINDOWTITLE eq Tatwats Server" /F >nul 2>&1
if %errorlevel% equ 0 (
    echo Tatwats Server stopped.
) else (
    echo Tatwats Server process not found or could not be terminated.
)

REM Find and kill the client process by window title
taskkill /FI "WINDOWTITLE eq Tatwats Client" /F >nul 2>&1
if %errorlevel% equ 0 (
    echo Tatwats Client stopped.
) else (
    echo Tatwats Client process not found or could not be terminated.
)

echo Stop process complete.