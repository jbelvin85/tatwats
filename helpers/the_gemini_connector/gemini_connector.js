require('dotenv').config({ path: '../../.env' }); // Load .env from project root

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const express = require('express'); // Add express
const fetch = require('node-fetch'); // Using node-fetch for HTTP requests

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in the environment variables.');
    process.exit(1);
}

// Use an environment variable for the API URL, with a sensible default for local development.
const CHAT_API_BASE_URL = process.env.CHAT_API_BASE_URL || 'http://backend:3001/api';
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const conversationHistory = new Map(); // Stores conversation history by conversation_id

const HELPER_NAME = 'the_gemini_connector';
let HELPER_USER_ID = null; // To store the user ID for this helper

async function ensureHelperUserExists() {
    try {
        // Check if user exists
        const response = await fetch(`${CHAT_API_BASE_URL}/users`);
        const users = await response.json();
        const existingUser = users.find(user => user.name === HELPER_NAME);

        if (existingUser) {
            HELPER_USER_ID = existingUser.id;
            console.log(`Helper user '${HELPER_NAME}' already exists with ID: ${HELPER_USER_ID}`);
        } else {
            // Create user if not exists
            const createResponse = await fetch(`${CHAT_API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: HELPER_NAME })
            });
            const newUser = await createResponse.json();
            HELPER_USER_ID = newUser.id;
            console.log(`Created helper user '${HELPER_NAME}' with ID: ${HELPER_USER_ID}`);
        }
    } catch (error) {
        console.error('Error ensuring helper user exists:', error);
        process.exit(1);
    }
}

async function sendMessage(conversation_id, sender_id, content) {
    try {
        const response = await fetch(`${CHAT_API_BASE_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversation_id, sender_id, content })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(`Message sent to conversation ${conversation_id} by ${sender_id}: ${result.id}`);
    } catch (error) {
        console.error(`Error sending message to chat API:`, error);
    }
}

async function processGeminiRequest(message) {
    const { sender_id, conversation_id, content } = message; // Assuming message comes from the chat API
    const { query, reset_conversation } = content; // Assuming content contains query and reset_conversation

    let history = conversationHistory.get(conversation_id) || [];

    if (reset_conversation) {
        console.log(`Resetting conversation for ${conversation_id}`);
        history = [];
    }

    console.log(`Processing Gemini request from ${sender_id} (Conversation: ${conversation_id}): "${query}"`);

    try {
        const chat = model.startChat({ history: history });
        const result = await chat.sendMessage(query);
        const responseText = result.response.text();
        console.log(`Gemini response: "${responseText}"`);

        // Update history
        history.push({ role: "user", parts: [{ text: query }] });
        history.push({ role: "model", parts: [{ text: responseText }] });
        conversationHistory.set(conversation_id, history);

        // Send response back to the conversation
        await sendMessage(conversation_id, HELPER_USER_ID, { type: 'gemini_response', content: responseText });

    } catch (error) {
        console.error('Error generating content from Gemini:', error);
        await sendMessage(conversation_id, HELPER_USER_ID, { type: 'error', content: 'Failed to get response from Gemini.' });
    }
}

// The `processReportRequest` function also needs to be updated to use the new chat API.
// For now, I will comment it out as it's not directly related to the core Gemini interaction.
/*
async function processReportRequest(message) {
    const { sender, message: reportContent } = message;
    const { reporter_id, task_id, status, details, conversation_id } = reportContent;

    console.log(`Received report from ${sender}: Status - ${status}, Details - ${details}`);

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: "Log this report." }] }],
            tools: [{
                function_declarations: [{
                    name: "log_report",
                    description: "Logs a report about a task or status.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            reporter_id: { type: "STRING", description: "ID of the helper reporting." },
                            task_id: { type: "STRING", description: "Optional ID of the task being reported on." },
                            status: { type: "STRING", description: "Status of the task (e.g., 'completed', 'in_progress', 'failed')." },
                            details: { type: "STRING", description: "Detailed description of the report." }
                        },
                        required: ["reporter_id", "status", "details"]
                    }
                }]
            }],
            tool_config: {
                function_calling_config: {
                    mode: "ANY"
                }
            }
        });

        const call = result.response.candidates[0].content.parts[0].functionCall;

        if (call && call.name === "log_report") {
            console.log("Executing log_report tool call:", call.args);
            await sendMessage(sender, HELPER_NAME, { type: 'report_ack', content: 'Report received and logged.', conversation_id: conversation_id });
        } else {
            console.warn("Gemini did not suggest calling log_report tool for the report.");
            await sendMessage(sender, HELPER_NAME, { type: 'error', content: 'Failed to process report via Gemini.', conversation_id: conversation_id });
        }

    } catch (error) {
        console.error('Error processing report via Gemini:', error);
        await sendMessage(sender, HELPER_NAME, { type: 'error', content: 'Failed to process report via Gemini.', conversation_id: conversation_id });
    }
}
*/

app.post('/webhook', (req, res) => {
    console.log('Received webhook call');
    const message = req.body; // The message object from the main backend
    
    // We can make this asynchronous and not wait for Gemini to respond
    // to keep the webhook lightweight.
    processGeminiRequest(message);
    
    res.status(202).send('Accepted'); // Acknowledge receipt of the webhook
});

async function start() {
    console.log(`${HELPER_NAME} is starting...`);
    await ensureHelperUserExists();
    
    app.listen(PORT, () => {
        console.log(`${HELPER_NAME} is listening for webhooks on port ${PORT}`);
    });
}

start();