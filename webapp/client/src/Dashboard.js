import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import RecentChatsCard from './RecentChatsCard';
import './Dashboard.css';

const Dashboard = () => {
  const [userCount, setUserCount] = useState('...');
  const [conversationCount, setConversationCount] = useState('...');
  const [messageCount, setMessageCount] = useState('...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch User Count
        const usersResponse = await fetch('http://localhost:3001/api/users');
        if (!usersResponse.ok) throw new Error(`HTTP error! status: ${usersResponse.status} for users`);
        const usersData = await usersResponse.json();
        setUserCount(usersData.length);

        // Fetch Conversation Count
        const conversationsResponse = await fetch('http://localhost:3001/api/conversations');
        if (!conversationsResponse.ok) throw new Error(`HTTP error! status: ${conversationsResponse.status} for conversations`);
        const conversationsData = await conversationsResponse.json();
        setConversationCount(conversationsData.length);

        // Fetch Message Count (This will fetch all messages, might be slow for large datasets)
        // A dedicated endpoint for total message count would be more efficient.
        const messagesResponse = await fetch('http://localhost:3001/api/messages'); // Assuming this endpoint exists and returns all messages
        if (!messagesResponse.ok) throw new Error(`HTTP error! status: ${messagesResponse.status} for messages`);
        const messagesData = await messagesResponse.json();
        setMessageCount(messagesData.length);

      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        setError('Could not load dashboard data. Is the backend server running and database initialized?');
        setUserCount('Error');
        setConversationCount('Error');
        setMessageCount('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Consider adding polling if these counts need to be real-time
    // const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Application Overview Dashboard</h2>
      <div className="dashboard-summary">
        <p>Welcome to your application overview. This dashboard provides key insights into your application's data.</p>
      </div>

      {loading && <p className="loading-message">Loading statistics...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Summary Statistics</h3>
          <p>Total Users: <strong>{userCount}</strong></p>
          <p>Total Conversations: <strong>{conversationCount}</strong></p>
          <p>Total Messages: <strong>{messageCount}</strong></p>
        </div>
      )}

      <RecentChatsCard />
    </div>
  );
};

export default Dashboard;