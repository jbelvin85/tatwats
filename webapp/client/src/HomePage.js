import React, { useState, useEffect } from 'react';

function HomePage() {
  const [serverStatus, setServerStatus] = useState('checking...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/status/server'); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServerStatus(data.status);
      } catch (e) {
        console.error("Failed to fetch server status:", e);
        setError('Could not connect to backend server.');
        setServerStatus('offline');
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>TATWATS Administrator Control Panel</h1>
      <p>This is the central hub for managing your processes, helpers, and communications.</p>
      <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block' }}>
        <h2>Backend Server Status: </h2>
        {error ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
        ) : (
          <p style={{ color: serverStatus === 'online' ? 'green' : 'orange', fontWeight: 'bold' }}>
            {serverStatus.toUpperCase()}
          </p>
        )}
      </div>
      <p style={{ marginTop: '20px' }}>Use the navigation above to explore different sections.</p>
    </div>
  );
}

export default HomePage;
