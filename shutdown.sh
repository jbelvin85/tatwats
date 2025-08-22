#!/bin/bash

echo "--- TATWATS Shutdown Script ---"

echo "Stopping all services with Docker Compose..."
docker-compose down
if [ $? -ne 0 ]; then
    echo "Error: Failed to stop services with Docker Compose."
    exit 1
fi
echo "All services stopped."

echo "Shutdown complete."
