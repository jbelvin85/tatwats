@echo off

REM Start the server
echo Starting Tatwats Server...
start "Tatwats Server" cmd /k "cd webapp\server && set PORT=3001 && npm start"

REM Start the client
echo Starting Tatwats Client...
start "Tatwats Client" cmd /k "cd webapp\client && npm start"

echo All components started. Check the new command windows.
