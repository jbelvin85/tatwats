#!/bin/bash

# Stop the Backend Server
pkill -f "node index.js"

# Stop the Frontend Application
pkill -f "react-scripts start"

# Stop the Message Listener
pkill -f "node message_listener.js"

echo "All running components stopped (if found)."
