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

REM Find and kill the Gemini Connector process by window title
taskkill /FI "WINDOWTITLE eq Gemini Connector" /F >nul 2>&1
if %errorlevel% equ 0 (
    echo Gemini Connector stopped.
) else (
    echo Gemini Connector process not found or could not be terminated.
)

echo Stop process complete.