import React from 'react';
import HelperAdmin from './HelperAdmin'; // Import HelperAdmin

function Dashboard() {
  return (
    <div className="dashboard-container">
      <HelperAdmin /> {/* Render the HelperAdmin component */}
    </div>
  );
}

export default Dashboard;