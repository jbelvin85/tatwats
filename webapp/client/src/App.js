import UserManagement from './UserManagement'; // Import the new UserManagement component

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';

import HelperAdmin from './HelperAdmin';
import Header from './Header';
import ChatApp from './ChatApp';
import HomePage from './HomePage'; // New component for the home page

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* Render the Header component */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/processes" element={<Dashboard />} />
            <Route path="/helpers" element={<HelperAdmin />} />
            <Route path="/chat" element={<ChatApp />} />
            <Route path="/users" element={<UserManagement />} /> {/* New route for User Management */}
            {/* If ChatMonitor is a separate page, add a route for it */}
            {/* <Route path="/chat-monitor" element={<ChatMonitor />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;