import React from 'react';
import './ProcessCard.css'; // We'll create this CSS file next

const ProcessCard = ({ name, status, onStart, onStop }) => {
  const statusClass = status.toLowerCase().replace(' ', '-');

  return (
    <div className={`process-card ${statusClass}`}>
      <h3>{name}</h3>
      <p>Status: <span className={`status-text ${statusClass}`}>{status}</span></p>
      <div className="process-actions">
        <button onClick={onStart} disabled={status === 'Running'}>Start</button>
        <button onClick={onStop} disabled={status === 'Stopped'}>Stop</button>
      </div>
      {/* Placeholder for terminal output */}
      <div className="terminal-output">
        <pre>Logs will appear here...</pre>
      </div>
    </div>
  );
};

export default ProcessCard;
