import React from 'react';
import './App.css';
import Dashboard from './Dashboard'; // Import the new Dashboard component
import ChatMonitor from './ChatMonitor'; // Import the new ChatMonitor component
import Header from './Header'; // Import the new Header component

function App() {
  return (
    <div className="App">
      <Header /> {/* Render the Header component */}
      <main>
        <Dashboard /> {/* Render the Dashboard component */}
        <ChatMonitor /> {/* Render the ChatMonitor component */}
      </main>
      
    </div>
  );
}

export default App;