import React from 'react';
import './App.css';
import Dashboard from './Dashboard'; // Import the new Dashboard component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TATWATS</h1>
        <p>The Gemini CLI has successfully modified your React application.</p>
      </header>
      <main>
        <Dashboard /> {/* Render the Dashboard component */}
      </main>
    </div>
  );
}

export default App;
