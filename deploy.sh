#!/bin/bash

echo "--- TATWATS Deploy Script ---"

echo "Running shutdown script to ensure a clean state..."
./shutdown.sh || echo "Warning: Shutdown script encountered an error, but proceeding with deployment."

# Check for .env file and run setup if it doesn't exist
if [ ! -f .env ]; then
    echo ".env file not found. Running setup..."
    ./setup.sh
fi

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "Environment variables loaded from .env"
else
    echo "ERROR: .env file not found and setup failed."
    exit 1
fi

echo "Building and starting all services with Docker Compose..."
docker-compose up -d --build
if [ $? -ne 0 ]; then
    echo "Error: Failed to start services with Docker Compose."
    exit 1
fi
echo "All services started."

echo "Deployment complete. Access the application at http://localhost:3000 (frontend) and http://localhost:3001 (backend API)."
echo "To stop all services, run the shutdown script."
