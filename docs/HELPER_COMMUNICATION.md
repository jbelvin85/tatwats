## Helper Communication System Setup

We have successfully set up a multi-component system for helper communication, including a web-based dashboard and an AI-powered message listener.

### 1. Prerequisites for Gemini Integration:

*   **Gemini API Key**: You need a Google Cloud project with the Gemini API enabled and an API key.
    *   Go to the Google Cloud Console.
    *   Create a new project or select an existing one.
    *   Enable the "Generative Language API" (or "Gemini API" if it's named differently).
    *   Go to "APIs & Services" -> "Credentials" and create an API key.
*   **Environment Variable**: Set your Gemini API key as an environment variable named `GEMINI_API_KEY` in your terminal session before starting the `message_listener.js` script.
    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```
    (Replace `YOUR_API_KEY_HERE` with your actual key).

### 2. Start the Backend Server:

This server provides the API for the frontend to interact with the message system.

*   Navigate to the server directory:
    ```bash
    cd /home/user/Github/tatwats/webapp/server
    ```
*   Install dependencies (if you haven't already):
    ```bash
    npm install
    ```
*   Start the server:
    ```bash
    npm start
    ```
    You should see `Server running on http://localhost:3001` in your terminal. Keep this terminal open.

### 3. Start the Frontend Application:

This is your web-based dashboard to manage helpers and view conversations.

*   Navigate to the client directory:
    ```bash
    cd /home/user/Github/tatwats/webapp/client
    ```
*   Install dependencies (if you haven't already):
    ```bash
    npm install
    ```
*   Start the React development server:
    ```bash
    npm start
    ```
    This will usually open the application in your web browser at `http://localhost:3000`. Keep this terminal open.

### 4. Start the Message Listener:

This script watches for new messages and uses the Gemini interpreter to generate responses from helpers.

*   Navigate to the scripts directory:
    ```bash
    cd /home/user/Github/tatwats/helpers/the_mediator/scripts
    ```
*   **Important**: Ensure your `GEMINI_API_KEY` environment variable is set in this terminal session.
*   Run the listener:
    ```bash
    node message_listener.js
    ```
    You should see `Message listener started. Waiting for new messages...` in your terminal. Keep this terminal open.

### 5. Test the Communication:

*   Open your web dashboard (`http://localhost:3000`).
*   Use the "Send Message" form to send a message from one helper (e.g., `the_wizard`) to another (e.g., `the_author`).
*   Observe the `message_listener.js` terminal. You should see it detect the new message, process it, and send a response.
*   Refresh the recipient helper's messages in the web dashboard to see the AI-generated reply.

### Summary of Components:

*   **`helpers/the_mediator/the.MEDIATOR.md`**: Documentation for the communication system.
*   **`helpers/the_mediator/common_room/`**: The shared message space with inboxes for each helper.
*   **`helpers/the_mediator/scripts/send_message.sh`**: CLI script to send messages.
*   **`helpers/the_mediator/scripts/check_messages.sh`**: CLI script to check messages.
*   **`helpers/the_mediator/scripts/read_message.sh`**: CLI script to read message content.
*   **`helpers/the_mediator/scripts/gemini_interpreter.js`**: Node.js script that interfaces with the Gemini API to generate helper responses based on their personas.
*   **`helpers/the_mediator/scripts/message_listener.js`**: Node.js script that watches for new messages, triggers the interpreter, and manages message flow.
*   **`webapp/server/`**: Node.js Express backend providing API endpoints for the frontend.
*   **`webapp/client/`**: React frontend application for the web dashboard.

You now have a fully functional, AI-powered helper communication system!
