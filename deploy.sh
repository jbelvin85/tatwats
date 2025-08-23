#!/bin/bash

echo "--- TATWATS Deploy Script ---"

# Check for .env file and run setup if it doesn't exist
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please run the setup script first:"
    echo "    ./setup.sh"
    exit 1
fi

echo "Stopping any currently running services to ensure a clean state..."
docker-compose down

echo "Building and starting all services with Docker Compose..."
docker-compose up -d --build
if [ $? -ne 0 ]; then
    echo "Error: Failed to start services with Docker Compose."
    exit 1
fi
echo "All services started."

echo "Deployment complete. Access the application at http://localhost:3000 (frontend) and http://localhost:3001 (backend API)."
echo "To stop all services, run the shutdown script."
