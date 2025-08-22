#!/bin/bash

echo "--- TATWATS Setup Script ---"

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose not found. Please install Docker Desktop (which includes Docker Compose) or Docker Engine with Compose plugin."
    echo "See: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "Docker Compose found. Proceeding with setup."

# Initialize variables with defaults from .env.example
GEMINI_API_KEY_VAR="YOUR_GEMINI_API_KEY_HERE"
TATWATS_USERNAME_VAR="YOUR_GENERATED_USERNAME"
TATWATS_PASSWORD_VAR="YOUR_GENERATED_PASSWORD"
PGHOST_VAR="localhost"
PGUSER_VAR="postgres"
PGPASSWORD_VAR="your_postgres_password"
PGDATABASE_VAR="tatwats"
PGPORT_VAR="5432"

echo ""
echo "--- Environment Variable Configuration ---"
echo "Please provide values for the following environment variables."
echo "Press Enter to accept the default value in parentheses."

read -p "Enter your Gemini API Key (default: ${GEMINI_API_KEY_VAR}): " INPUT_GEMINI_API_KEY
GEMINI_API_KEY_VAR=${INPUT_GEMINI_API_KEY:-$GEMINI_API_KEY_VAR}

read -p "Enter Tatwats Username (default: ${TATWATS_USERNAME_VAR}): " INPUT_TATWATS_USERNAME
TATWATS_USERNAME_VAR=${INPUT_TATWATS_USERNAME:-$TATWATS_USERNAME_VAR}

read -p "Enter Tatwats Password (default: ${TATWATS_PASSWORD_VAR}): " INPUT_TATWATS_PASSWORD
TATWATS_PASSWORD_VAR=${INPUT_TATWATS_PASSWORD:-$TATWATS_PASSWORD_VAR}

read -p "Enter PostgreSQL Host (default: ${PGHOST_VAR}): " INPUT_PGHOST
PGHOST_VAR=${INPUT_PGHOST:-$PGHOST_VAR}

read -p "Enter PostgreSQL User (default: ${PGUSER_VAR}): " INPUT_PGUSER
PGUSER_VAR=${INPUT_PGUSER:-$PGUSER_VAR}

read -p "Enter PostgreSQL Password (default: ${PGPASSWORD_VAR}): " INPUT_PGPASSWORD
PGPASSWORD_VAR=${INPUT_PGPASSWORD:-$PGPASSWORD_VAR}

read -p "Enter PostgreSQL Database Name (default: ${PGDATABASE_VAR}): " INPUT_PGDATABASE
PGDATABASE_VAR=${INPUT_PGDATABASE:-$PGDATABASE_VAR}

read -p "Enter PostgreSQL Port (default: ${PGPORT_VAR}): " INPUT_PGPORT
PGPORT_VAR=${INPUT_PGPORT:-$PGPORT_VAR}

# Create .env file
echo "Creating .env file..."
cat << EOF > .env
GEMINI_API_KEY="${GEMINI_API_KEY_VAR}"
TATWATS_USERNAME="${TATWATS_USERNAME_VAR}"
TATWATS_PASSWORD="${TATWATS_PASSWORD_VAR}"
PGHOST=${PGHOST_VAR}
PGUSER=${PGUSER_VAR}
PGPASSWORD=${PGPASSWORD_VAR}
PGDATABASE=${PGDATABASE_VAR}
PGPORT=${PGPORT_VAR}
EOF

echo ".env file created successfully."
echo "Setup complete. You can now run the deploy script."
