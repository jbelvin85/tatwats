@echo off
setlocal enabledelayedexpansion
echo Stopping all TATWATS components...

REM Stop the Backend Server
echo.
echo Attempting to stop Backend Server (node index.js)...
for /f "tokens=2, *" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /FO LIST ^| findstr /B /C:"PID:" /C:"Command Line:"') do (
    if "%%a"=="PID:" (
        set "current_pid=%%b"
    ) else if "%%a"=="Command" (
        set "command_line=%%b"
        echo !command_line! | findstr /I "webapp\\server\\index.js" >nul
        if not errorlevel 1 (
            echo Found Backend Server process with PID: !current_pid!
            taskkill /PID !current_pid! /F >nul
            if !ERRORLEVEL! equ 0 (
                echo Backend Server stopped successfully.
            ) else (
                echo Failed to terminate Backend Server process with PID: !current_pid!
            )
        )
    )
)

REM Stop the Frontend Application

echo.
echo Attempting to stop Frontend Application on port 3000...
set "found_frontend=false"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    set "found_frontend=true"
    echo Found process on port 3000 with PID: %%a
    taskkill /PID %%a /F
    if !ERRORLEVEL! equ 0 (
            echo Successfully terminated process with PID: !%%a!
        ) else (
            echo Failed to terminate process with PID: !%%a!
        )
)
if "%found_frontend%"=="false" (
    echo No Frontend Application process found on port 3000.
)

REM Stop the Message Listener
echo.
echo Attempting to stop Message Listener (node message_listener.js)...
for /f "tokens=2,*" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /FO LIST ^| findstr /B /C:"PID:" /C:"Command Line:"') do (
    if "%%a"=="PID:" (
        set "current_pid=%%b"
    ) else if "%%a"=="Command" (
        set "command_line=%%b"
        echo !command_line! | findstr /I "message_listener.js" >nul
        if not errorlevel 1 (
            echo Found Message Listener process with PID: !current_pid!
            taskkill /PID !current_pid! /F >nul
            if !ERRORLEVEL! equ 0 (
                echo Message Listener stopped successfully.
            ) else (
                echo Failed to terminate Message Listener process with PID: !current_pid!
            )
        )
    )
)

echo.
echo All running components stopped (if found).
