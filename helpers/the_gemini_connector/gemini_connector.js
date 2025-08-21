require('dotenv').config({ path: '../../.env' }); // Load .env from project root

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in the environment variables.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const conversationHistory = new Map(); // Stores conversation history by conversation_id

const HELPER_NAME = 'the_gemini_connector';
const COMMON_ROOM_PATH = path.join(__dirname, '..', 'the_mediator', 'common_room');
const INBOX_PATH = path.join(COMMON_ROOM_PATH, HELPER_NAME, 'inbox');

// Ensure inbox exists
if (!fs.existsSync(INBOX_PATH)) {
    fs.mkdirSync(INBOX_PATH, { recursive: true });
}

async function sendMessage(recipient, sender, messageContent) {
    const messageId = Date.now().toString();
    const messageFile = path.join(COMMON_ROOM_PATH, recipient, 'inbox', `${messageId}.json`);

    const message = {
        id: messageId,
        sender: sender,
        recipient: recipient,
        message: messageContent,
        timestamp: new Date().toISOString()
    };

    try {
        await fs.promises.writeFile(messageFile, JSON.stringify(message, null, 2));
        console.log(`Message sent from ${sender} to ${recipient}: ${messageId}`);
    } catch (error) {
        console.error(`Error sending message from ${sender} to ${recipient}:`, error);
    }
}

async function readMessages() {
    try {
        const files = await fs.promises.readdir(INBOX_PATH);
        const messageFiles = files.filter(file => file.endsWith('.json'));

        const messages = [];
        for (const file of messageFiles) {
            const filePath = path.join(INBOX_PATH, file);
            try {
                const content = await fs.promises.readFile(filePath, 'utf8');
                messages.push(JSON.parse(content));
                // Delete message after reading
                await fs.promises.unlink(filePath);
            } catch (error) {
                console.error(`Error reading or parsing message file ${file}:`, error);
            }
        }
        return messages;
    } catch (error) {
        console.error(`Error reading inbox for ${HELPER_NAME}:`, error);
        return [];
    }
}

async function processGeminiRequest(message) {
    const { sender, message: { query, conversation_id, reset_conversation, return_address } } = message;
    const currentConversationId = conversation_id || sender; // Use sender as default conversation_id

    let history = conversationHistory.get(currentConversationId) || [];

    if (reset_conversation) {
        console.log(`Resetting conversation for ${currentConversationId}`);
        history = [];
    }

    console.log(`Processing Gemini request from ${sender} (Conversation: ${currentConversationId}): "${query}"`);

    try {
        const chat = model.startChat({ history: history });
        const result = await chat.sendMessage(query);
        const responseText = result.response.text();
        console.log(`Gemini response: "${responseText}"`);

        // Update history
        history.push({ role: "user", parts: [{ text: query }] });
        history.push({ role: "model", parts: [{ text: responseText }] });
        conversationHistory.set(currentConversationId, history);

        // Send response back to the sender or return_address
        const replyRecipient = return_address || sender;
        await sendMessage(replyRecipient, HELPER_NAME, { type: 'gemini_response', content: responseText, conversation_id: currentConversationId });

    } catch (error) {
        console.error('Error generating content from Gemini:', error);
        await sendMessage(sender, HELPER_NAME, { type: 'error', content: 'Failed to get response from Gemini.', conversation_id: currentConversationId });
    }
}

async function mainLoop() {
    console.log(`${HELPER_NAME} is running...`);
    while (true) {
        const messages = await readMessages();
        for (const message of messages) {
            if (message.message && message.message.type === 'gemini_request') {
                await processGeminiRequest(message);
            } else {
                console.log(`Received unhandled message from ${message.sender}:`, message.message);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
    }
}

mainLoop();
