import React from 'react';
import HelperAdmin from './HelperAdmin'; // Import HelperAdmin

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the TATWATS Dashboard!</h1>
      <p>This is a simple dashboard to manage your helpers.</p>
      <HelperAdmin /> {/* Render the HelperAdmin component */}
    </div>
  );
}

export default Dashboard;