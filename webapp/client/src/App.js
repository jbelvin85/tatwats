import React, { useState, useEffect } from 'react';

function App() {
  const [helpers, setHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/helpers');
      const data = await response.json();
      setHelpers(data);
    } catch (error) {
      console.error('Error fetching helpers:', error);
    }
  };

  const fetchMessages = async (helperName) => {
    try {
      const response = await fetch(`http://localhost:3001/api/helpers/${helperName}/messages`);
      const data = await response.json();
      setMessages(data);
      setSelectedHelper(helperName);
      setSelectedMessage(null); // Clear selected message when helper changes
    } catch (error) {
      console.error(`Error fetching messages for ${helperName}:`, error);
    }
  };

  const fetchMessageDetail = async (helperName, messageId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/helpers/${helperName}/messages/${messageId}`);
      const data = await response.json();
      setSelectedMessage(data);
    } catch (error) {
      console.error(`Error fetching message ${messageId} for ${helperName}:`, error);
    }
  };

  const sendMessage = async (sender, recipient, message) => {
    try {
      await fetch(`http://localhost:3001/api/helpers/${recipient}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, message }),
      });
      // Refresh messages for the recipient after sending
      if (selectedHelper === recipient) {
        fetchMessages(recipient);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="App">
      <h1>Helper Communication Dashboard</h1>
      <div className="container">
        <div className="sidebar">
          <h2>Helpers</h2>
          <ul>
            {helpers.map((helper) => (
              <li key={helper} onClick={() => fetchMessages(helper)} className={selectedHelper === helper ? 'active' : ''}>
                {helper}
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          {selectedHelper && (
            <div className="message-list">
              <h2>Messages for {selectedHelper}</h2>
              <ul>
                {messages.map((msg) => (
                  <li key={msg.id} onClick={() => fetchMessageDetail(selectedHelper, msg.id)} className={selectedMessage && selectedMessage.id === msg.id ? 'active' : ''}>
                    From: {msg.sender} - {msg.message.substring(0, 50)}...
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedMessage && (
            <div className="message-detail">
              <h2>Message Detail</h2>
              <p><strong>From:</strong> {selectedMessage.sender}</p>
              <p><strong>To:</strong> {selectedMessage.recipient}</p>
              <p><strong>Timestamp:</strong> {new Date(selectedMessage.timestamp).toLocaleString()}</p>
              <p><strong>Message:</strong></p>
              <pre>{selectedMessage.message}</pre>
            </div>
          )}

          <div className="send-message-form">
            <h2>Send Message</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const sender = e.target.sender.value;
              const recipient = e.target.recipient.value;
              const message = e.target.message.value;
              sendMessage(sender, recipient, message);
              e.target.reset();
            }}>
              <input type="text" name="sender" placeholder="Your Helper Name (e.g., the_wizard)" required />
              <input type="text" name="recipient" placeholder="Recipient Helper Name (e.g., the_author)" required />
              <textarea name="message" placeholder="Your message" required></textarea>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
