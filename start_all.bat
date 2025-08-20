@echo off
echo Starting all TATWATS components...

REM Start the Backend Server in a new window
echo.

echo Starting Backend Server...
start cmd /k "cd webapp\server && npm start"

REM Start the Frontend Application in a new window
echo.

echo Starting Frontend Application...
start cmd /k "cd webapp\client && npm start"

REM Start the Message Listener in a new window
echo.

echo Starting Message Listener...
start cmd /k "cd helpers\the_mediator\scripts && start-listener.bat"

echo.

echo All components started. Please check the individual command prompt windows for status.
