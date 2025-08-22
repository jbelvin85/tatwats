import React, { useState, useEffect } from 'react';

const RecentChatsCard = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/conversations');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setConversations(data);
                setError(null);
            } catch (e) {
                console.error("Failed to fetch conversations:", e);
                setError('Could not load recent chats.');
                setConversations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
        // Optional: Poll for new conversations or updates
        const interval = setInterval(fetchConversations, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="recent-chats-card">
            <h3>Recent Conversations</h3>
            {loading && <p>Loading chats...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
                conversations.length > 0 ? (
                    <ul>
                        {conversations.map(conv => (
                            <li key={conv.id}>
                                {conv.name || `Conversation ${conv.id} (${conv.type})`}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent conversations.</p>
                )
            )}
        </div>
    );
};

export default RecentChatsCard;
