# Conversation Tracking System: Step-by-Step Implementation

This document outlines the step-by-step process for implementing a robust conversation tracking system within the tatwats project. This system will capture and display all communications between helpers and with the Gemini API, providing a comprehensive chat/forum-like view.

## Phase 1: Database Setup and Data Model

### Step 1.1: Define Database Schema for Messages

*   **Objective:** Design the structure of the `messages` table in our PostgreSQL database to store all conversation data.
*   **Details:**
    *   `id` (Primary Key, UUID or auto-incrementing integer): Unique identifier for each message.
    *   `conversation_id` (UUID): Groups related messages, e.g., a single interaction with Gemini API or a continuous helper-to-helper chat.
    *   `sender_type` (TEXT): Categorizes the sender (e.g., 'helper', 'gemini_api').
    *   `sender_id` (TEXT): Specific identifier of the sender (e.g., 'the_architect', 'gemini_api').
    *   `receiver_type` (TEXT): Categorizes the receiver (e.g., 'helper', 'gemini_api').
    *   `receiver_id` (TEXT): Specific identifier of the receiver (e.g., 'the_author', 'gemini_api').
    *   `message_type` (TEXT): Defines the nature of the content (e.g., 'text', 'tool_code', 'tool_output', 'api_request', 'api_response').
    *   `content` (TEXT): The actual message content, code snippet, or tool output.
    *   `timestamp` (TIMESTAMP WITH TIME ZONE): When the message was recorded (default to `NOW()`).
    *   `tool_name` (TEXT, Optional): If `message_type` is `tool_code` or `tool_output`, the name of the tool used.
    *   `tool_args` (JSONB, Optional): If `message_type` is `tool_code` or `tool_output`, the arguments passed to the tool.
    *   `raw_api_request` (JSONB, Optional): For Gemini API interactions, the raw request payload.
    *   `raw_api_response` (JSONB, Optional): For Gemini API interactions, the raw response payload.
*   **Considerations:** Add indexes for `conversation_id`, `sender_id`, `receiver_id`, and `timestamp` to optimize query performance.

### Step 1.2: Database Integration (Backend)

*   **Objective:** Connect our Node.js backend to the PostgreSQL database.
*   **Details:**
    *   Utilize Prisma (already in use for PodTracker) as our ORM for consistent data access.
    *   Configure database connection strings and initialize Prisma client in the backend application.

## Phase 2: Backend API for Message Handling

### Step 2.1: Create API Endpoints

*   **Objective:** Develop RESTful API endpoints to facilitate storing and retrieving messages.
*   **Details:**
    *   `POST /api/messages`: Endpoint for helpers and the Gemini API connector to send messages for storage.
    *   `GET /api/messages`: Endpoint to retrieve messages. This endpoint should support query parameters for filtering (e.g., `conversation_id`, `sender_id`, `receiver_id`, `start_date`, `end_date`, `limit`, `offset`).

### Step 2.2: Modify Existing Messaging Scripts

*   **Objective:** Reroute message handling from file-based operations to the new database API.
*   **Details:**
    *   Update `helpers/the_mediator/scripts/send_message.js` to send messages to `POST /api/messages`.
    *   Update `helpers/the_mediator/scripts/read_message.js` and `check_messages.js` to fetch messages from `GET /api/messages`.
    *   Modify `helpers/the_gemini_connector/gemini_connector.js` to log all Gemini API requests and responses by sending them to `POST /api/messages`.

## Phase 3: Frontend Conversation Viewer

### Step 3.1: Create Frontend Component

*   **Objective:** Develop a new React component to display the conversation log.
*   **Details:**
    *   Create a new component (e.g., `ConversationViewer.js` or `ChatLog.js`) within `webapp/client/src/`.
    *   This component will be responsible for making `GET` requests to the backend's `/api/messages` endpoint to retrieve conversation data.

### Step 3.2: Design UI

*   **Objective:** Create an intuitive and user-friendly interface for viewing conversations.
*   **Details:**
    *   Display messages chronologically, resembling a typical chat or forum layout.
    *   Clearly present sender, receiver, timestamp, and message content.
    *   Implement user-friendly filtering and search functionalities (e.g., filter by specific helper, date range, or message type).

## Phase 4: Data Migration (Optional but Recommended)

### Step 4.1: Develop Migration Script

*   **Objective:** Transfer existing file-based messages into the new database.
*   **Details:**
    *   Create a one-time script to read all historical JSON message files from `helpers/the_mediator/common_room/`.
    *   Parse these files and insert the data into the new `messages` database table, mapping existing fields to the new schema.
