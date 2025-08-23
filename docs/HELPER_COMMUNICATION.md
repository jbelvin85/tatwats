# Helper Communication System Overview

This document outlines the current architecture for inter-helper communication within the TATWATS project. The system has transitioned from a file-based polling mechanism to a more scalable, database-driven, and event-based approach using PostgreSQL and webhooks.

## 1. Core Principles

*   **Database-Centric:** All helper messages and conversation states are stored in a central PostgreSQL database.
*   **API-Driven:** Helpers interact with the communication system via a set of RESTful API endpoints exposed by the backend server.
*   **Event-Based (Webhooks):** Instead of polling, helpers can be configured to receive messages via webhooks, allowing for real-time communication.
*   **Decoupled:** Helpers are decoupled from the underlying message storage mechanism, interacting only with the defined API.

## 2. Key Components and Flow

### a. PostgreSQL Database

*   **Role:** The central repository for all chat messages, conversation threads, and helper metadata.
*   **Interaction:** The backend server (`webapp/server`) is responsible for all database interactions.

### b. Backend API Server (`webapp/server`)

*   **Role:** Exposes API endpoints for:
    *   Sending messages between helpers or to users.
    *   Retrieving conversation history.
    *   Managing helper configurations (though this is primarily done via the Admin Control Panel).
*   **Technology:** Node.js with Express.js and `pg` (PostgreSQL client).
*   **Key Files:**
    *   `webapp/server/index.js`: Main server entry point, sets up Express app and mounts routes.
    *   `webapp/server/routes.js`: Defines all API endpoints for chat, helpers, and other functionalities.
    *   `webapp/server/database.js`: Handles PostgreSQL connection pooling and database initialization.

### c. Frontend Application (`webapp/client`)

*   **Role:** Provides the Admin Control Panel and user interface for interacting with the helper communication system.
*   **Interaction:** Communicates with the Backend API Server to send and receive messages, display chat history, and manage helpers.

### d. Helper Modules (e.g., `helpers/the_gemini_connector`)

*   **Role:** Individual AI agents or utility scripts that perform specific tasks.
*   **Interaction:** Use `node-fetch` or similar HTTP clients to send messages to the backend API. They can also expose their own webhook endpoints to receive messages from the backend.
*   **Example (`gemini_connector.js`):**
    *   The `sendMessage` function now makes an HTTP POST request to the backend's chat API.
    *   It can be configured to listen for incoming messages via a `/webhook` endpoint, which the backend can call when a new message relevant to this helper arrives.

## 3. Setup and Operation

The overall project setup and deployment are managed by `setup.bat`/`setup.sh` and `deploy.bat`/`deploy.sh` scripts.

1.  **Initial Setup**: Run `setup.bat` (Windows) or `./setup.sh` (Linux/macOS) to configure your environment variables and create the `.env` file. This includes database credentials.
2.  **Deploy Services**: Run `deploy.bat` (Windows) or `./deploy.sh` (Linux/macOS) to build Docker images and start all services (PostgreSQL, Backend, Frontend). This will bring up the entire communication infrastructure.
3.  **Helper Interaction**: Helpers like `the_gemini_connector` are designed to be run as separate processes (e.g., within their own Docker containers or as Node.js processes). They will communicate with the backend API over the Docker network (e.g., `http://backend:3001/api`).

## 4. Deprecated Components

The following components related to the old file-based communication system have been removed:

*   `helpers/the_mediator/scripts/`: Contained old `send_message.js`, `check_messages.js`, `etc.`
*   `helpers/the_mediator/common_room/`: The directory used for file-based message inboxes.

This new architecture provides a more robust, scalable, and maintainable foundation for helper interactions.
