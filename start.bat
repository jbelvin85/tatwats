@echo off

REM Start the server
echo Starting Tatwats Server...
start "Tatwats Server" cmd /k "cd webapp\server && set PORT=3001 && npm start"

REM Start the client
echo Starting Tatwats Client...
start "Tatwats Client" cmd /k "cd webapp\client && npm start"

REM Start the Gemini Connector
start "Gemini Connector" cmd /k "cd helpers\the_gemini_connector && node gemini_connector.js"

echo All components started. Check the new command windows.
