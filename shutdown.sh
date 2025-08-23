#!/bin/bash

echo "--- TATWATS Shutdown Script ---"

read -p "This will stop all services and PERMANENTLY remove data volumes (including the database). Are you sure? (y/N) " -n 1 -r
echo # Move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Shutdown cancelled."
    exit 1
fi

echo "Stopping all services and removing volumes..."
docker-compose down --volumes
if [ $? -ne 0 ]; then
    echo "Error: Failed to stop services with Docker Compose."
    exit 1
fi
echo "All services and associated volumes have been removed."
echo "Shutdown complete."
