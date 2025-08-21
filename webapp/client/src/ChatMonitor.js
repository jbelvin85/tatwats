import React, { useState, useEffect } from 'react';

function ChatMonitor() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/messages/all');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please check the server and your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const formatMessageContent = (content) => {
    if (typeof content === 'object' && content !== null) {
      if (content.type === 'gemini_request') {
        return `Gemini Request: "${content.query}" (Conversation ID: ${content.conversation_id || 'N/A'})`;
      } else if (content.type === 'gemini_response') {
        return `Gemini Response: "${content.content}" (Conversation ID: ${content.conversation_id || 'N/A'})`;
      } else if (content.type === 'error') {
        return `Error: "${content.content}" (Conversation ID: ${content.conversation_id || 'N/A'})`;
      }
      return JSON.stringify(content, null, 2); // Fallback for other objects
    }
    return content; // For plain strings
  };

  return (
    <div className="chat-monitor-container">
      {loading && <p>Loading conversations...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div className="message-list">
          {messages.length === 0 ? (
            <p>No messages found yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="message-item">
                <div className="message-header">
                  <span className="sender">{msg.sender}</span>
                  <span className="arrow"> → </span>
                  <span className="recipient">{msg.recipient}</span>
                  <span className="timestamp">({new Date(msg.timestamp).toLocaleTimeString()})</span>
                </div>
                <pre className="message-content">
                  {formatMessageContent(msg.message)}
                </pre>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ChatMonitor;
