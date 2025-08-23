import React, { useState, useEffect } from 'react';
// No longer importing RecentChatsCard directly here, it can be composed elsewhere if needed.

function AdminDashboard() {
  // State for Server Status (from old HomePage.js)
  const [serverStatus, setServerStatus] = useState('checking...');
  const [serverError, setServerError] = useState(null);

  // State for Application Statistics (from old Dashboard.js)
  const [userCount, setUserCount] = useState('...');
  const [conversationCount, setConversationCount] = useState('...');
  const [messageCount, setMessageCount] = useState('...');
  const [appStatsLoading, setAppStatsLoading] = useState(true);
  const [appStatsError, setAppStatsError] = useState(null);

  // Effect to fetch Backend Server Status
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/status/server');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServerStatus(data.status);
        setServerError(null);
      } catch (e) {
        console.error("Failed to fetch server status:", e);
        setServerError('Could not connect to backend server.');
        setServerStatus('offline');
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Effect to fetch Application Statistics
  useEffect(() => {
    const fetchAppStats = async () => {
      setAppStatsLoading(true);
      setAppStatsError(null);
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

        // Fetch Message Count
        const messagesResponse = await fetch('http://localhost:3001/api/messages');
        if (!messagesResponse.ok) throw new Error(`HTTP error! status: ${messagesResponse.status} for messages`);
        const messagesData = await messagesResponse.json();
        setMessageCount(messagesData.length);

      } catch (e) {
        console.error("Failed to fetch application statistics:", e);
        setError('Could not load application statistics. Is the backend server running and database initialized?');
        setUserCount('Error');
        setConversationCount('Error');
        setMessageCount('Error');
      } finally {
        setAppStatsLoading(false);
      }
    };

    fetchAppStats();
    // No polling for app stats for now, can be added if needed
  }, []);


  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>TATWATS Administrator Control Panel</h1>
      <p>This is the central hub for managing your application's data and system health.</p>

      {/* Backend Server Status */}
      <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block', marginRight: '20px' }}>
        <h2>Backend Server Status: </h2>
        {serverError ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{serverError}</p>
        ) : (
          <p style={{ color: serverStatus === 'online' ? 'green' : 'orange', fontWeight: 'bold' }}>
            {serverStatus.toUpperCase()}
          </p>
        )}
      </div>

      {/* Application Statistics */}
      <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block' }}>
        <h3>Application Statistics</h3>
        {appStatsLoading && <p className="loading-message">Loading statistics...</p>}
        {appStatsError && <p className="error-message" style={{ color: 'red' }}>{appStatsError}</p>}
        {!appStatsLoading && !appStatsError && (
          <>
            <p>Total Users: <strong>{userCount}</strong></p>
            <p>Total Conversations: <strong>{conversationCount}</strong></p>
            <p>Total Messages: <strong>{messageCount}</strong></p>
          </>
        )}
      </div>

      <p style={{ marginTop: '20px' }}>Use the navigation above to explore different management sections.</p>
    </div>
  );
}

export default AdminDashboard;