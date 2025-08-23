#!/bin/bash

# A function to generate a random string for credentials
generate_random_string() {
    # Use openssl if available, otherwise fallback to a simpler method
    if command -v openssl &> /dev/null; then
        openssl rand -base64 16
    else
        # A less secure but more portable fallback
        date +%s | sha256sum | base64 | head -c 20
    fi
}

echo "--- TATWATS Setup Script ---"

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose not found. Please install Docker Desktop (which includes Docker Compose) or Docker Engine with Compose plugin."
    echo "See: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "Docker Compose found. Proceeding with setup."

# Check if .env file already exists
if [ -f .env ]; then
    read -p ".env file already exists. Do you want to overwrite it? (y/N) " -n 1 -r
    echo # Move to a new line
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Your existing .env file has been preserved."
        exit 1
    fi
fi

# Initialize variables with secure, random defaults.
GEMINI_API_KEY_VAR="YOUR_GEMINI_API_KEY_HERE"
TATWATS_USERNAME_VAR=$(generate_random_string)
TATWATS_PASSWORD_VAR=$(generate_random_string)
PGHOST_VAR="db" # Defaulting to 'db', the typical service name for a database in Docker Compose.
PGUSER_VAR="postgres"
PGPASSWORD_VAR=$(generate_random_string)
PGDATABASE_VAR="tatwats"
PGPORT_VAR="5432"

echo ""
echo "--- Environment Variable Configuration ---"
echo "Please provide values for the following environment variables."
echo "Press Enter to accept the generated/default value in brackets."

read -p "Enter your Gemini API Key [${GEMINI_API_KEY_VAR}]: " INPUT_GEMINI_API_KEY
GEMINI_API_KEY_VAR=${INPUT_GEMINI_API_KEY:-$GEMINI_API_KEY_VAR}

read -p "Enter Tatwats Username [${TATWATS_USERNAME_VAR}]: " INPUT_TATWATS_USERNAME
TATWATS_USERNAME_VAR=${INPUT_TATWATS_USERNAME:-$TATWATS_USERNAME_VAR}

# Use -s for silent password input. The prompt shows a placeholder for security.
read -s -p "Enter Tatwats Password [use generated]: " INPUT_TATWATS_PASSWORD
echo # Add a newline after silent input
TATWATS_PASSWORD_VAR=${INPUT_TATWATS_PASSWORD:-$TATWATS_PASSWORD_VAR}

read -p "Enter PostgreSQL Host [${PGHOST_VAR}]: " INPUT_PGHOST
PGHOST_VAR=${INPUT_PGHOST:-$PGHOST_VAR}

read -p "Enter PostgreSQL User [${PGUSER_VAR}]: " INPUT_PGUSER
PGUSER_VAR=${INPUT_PGUSER:-$PGUSER_VAR}

read -s -p "Enter PostgreSQL Password [use generated]: " INPUT_PGPASSWORD
echo
PGPASSWORD_VAR=${INPUT_PGPASSWORD:-$PGPASSWORD_VAR}

read -p "Enter PostgreSQL Database Name [${PGDATABASE_VAR}]: " INPUT_PGDATABASE
PGDATABASE_VAR=${INPUT_PGDATABASE:-$PGDATABASE_VAR}

read -p "Enter PostgreSQL Port [${PGPORT_VAR}]: " INPUT_PGPORT
PGPORT_VAR=${INPUT_PGPORT:-$PGPORT_VAR}

# Create .env file
echo "Creating .env file..."
cat << EOF > .env
GEMINI_API_KEY="${GEMINI_API_KEY_VAR}"
TATWATS_USERNAME="${TATWATS_USERNAME_VAR}"
TATWATS_PASSWORD="${TATWATS_PASSWORD_VAR}"
PGHOST="${PGHOST_VAR}"
PGUSER="${PGUSER_VAR}"
PGPASSWORD="${PGPASSWORD_VAR}"
PGDATABASE="${PGDATABASE_VAR}"
PGPORT="${PGPORT_VAR}"
EOF

echo ".env file created successfully."
echo "Setup complete. You can now run the deploy script."
