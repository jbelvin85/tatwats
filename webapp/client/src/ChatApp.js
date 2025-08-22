
import React, { useState, useEffect } from 'react';

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(1); // Hardcoded for MVP, assuming user with ID 1 exists

    // Fetch all conversations on component mount
    useEffect(() => {
        const fetchConversations = async () => {
            const response = await fetch('/api/conversations');
            const data = await response.json();
            setConversations(data);
            // Optionally select the first conversation by default
            if (data.length > 0) {
                setSelectedConversationId(data[0].id);
            }
        };
        fetchConversations();
    }, []);

    // Fetch messages for the selected conversation
    useEffect(() => {
        if (selectedConversationId) {
            const fetchMessages = async () => {
                const response = await fetch(`/api/conversations/${selectedConversationId}/messages`);
                const data = await response.json();
                setMessages(data);
            };
            fetchMessages();
            // Polling for new messages (simplified for MVP)
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedConversationId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !selectedConversationId || !currentUserId) return;

        const message = {
            conversation_id: selectedConversationId,
            sender_id: currentUserId,
            content: newMessage,
        };

        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });

        setNewMessage('');
        // Re-fetch messages to show the newly sent message
        const response = await fetch(`/api/conversations/${selectedConversationId}/messages`);
        const data = await response.json();
        setMessages(data);
    };

    return (
        <div>
            <h1>Group Chat MVP</h1>

            <div style={{ display: 'flex' }}>
                {/* Conversation List */}
                <div style={{ border: '1px solid #ccc', padding: '10px', width: '200px', marginRight: '10px' }}>
                    <h2>Conversations</h2>
                    <ul>
                        {conversations.map(conv => (
                            <li
                                key={conv.id}
                                onClick={() => setSelectedConversationId(conv.id)}
                                style={{ cursor: 'pointer', fontWeight: conv.id === selectedConversationId ? 'bold' : 'normal' }}
                            >
                                {conv.name || `Conversation ${conv.id} (${conv.type})`}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Chat Window */}
                <div style={{ flexGrow: 1 }}>
                    {selectedConversationId ? (
                        <>
                            <h2>{conversations.find(c => c.id === selectedConversationId)?.name || `Conversation ${selectedConversationId}`}</h2>
                            <div className="message-list">
                                {messages.map((msg) => (
                                    <p key={msg.id}><strong>User {msg.sender_id}:</strong> {msg.content}</p>
                                ))}
                            </div>
                            <div className="message-input">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <p>Select a conversation to start chatting.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
