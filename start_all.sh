#!/bin/bash

# Start the Backend Server in the background
(cd webapp/server && npm start) &

# Start the Frontend Application in the background
(cd webapp/client && npm start) &

# Start the Message Listener in the background
(cd helpers/the_mediator/scripts && ./start-listener.sh) &

echo "Backend, Frontend, and Message Listener started in the background."
echo "You may need to check their respective logs for output."
