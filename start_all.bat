@echo off

REM Start the Backend Server in a new window
start cmd /k "cd webapp\server && npm start"

REM Start the Frontend Application in a new window
start cmd /k "cd webapp\client && npm start"

REM Start the Message Listener in a new window
start cmd /k "cd helpers\the_mediator\scripts && start-listener.bat"
