import React, { useState, useEffect, useCallback } from 'react';
import ProcessCard from './ProcessCard';
import './Dashboard.css';

const Dashboard = () => {
  const [processes, setProcesses] = useState([
    { id: 'backend', name: 'Backend Server', status: 'Unknown' },
    { id: 'frontend', name: 'Frontend Client', status: 'Unknown' },
    { id: 'mediator', name: 'Message Listener', status: 'Unknown' },
  ]);

  const API_BASE_URL = 'http://localhost:3001/api/processes';

  const fetchProcessStatus = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/status/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error(`Error fetching status for ${id}:`, error);
      return 'Unknown';
    }
  }, []);

  const updateAllProcessStatuses = useCallback(async () => {
    const newProcesses = await Promise.all(processes.map(async (p) => {
      const status = await fetchProcessStatus(p.id);
      return { ...p, status };
    }));
    setProcesses(newProcesses);
  }, [processes, fetchProcessStatus]);

  useEffect(() => {
    updateAllProcessStatuses();

    const interval = setInterval(updateAllProcessStatuses, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [updateAllProcessStatuses]);

  const startProcess = async (id) => {
    setProcesses(prevProcesses =>
      prevProcesses.map(p =>
        p.id === id ? { ...p, status: 'Starting...' } : p
      )
    );
    try {
      const response = await fetch(`${API_BASE_URL}/start/${id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
      // After starting, immediately fetch the new status
      const newStatus = await fetchProcessStatus(id);
      setProcesses(prevProcesses =>
        prevProcesses.map(p =>
          p.id === id ? { ...p, status: newStatus } : p
        )
      );
    } catch (error) {
      console.error(`Error starting ${id}:`, error);
      setProcesses(prevProcesses =>
        prevProcesses.map(p =>
          p.id === id ? { ...p, status: 'Failed to Start' } : p
        )
      );
    }
  };

  const stopProcess = async (id) => {
    setProcesses(prevProcesses =>
      prevProcesses.map(p =>
        p.id === id ? { ...p, status: 'Stopping...' } : p
      )
    );
    try {
      const response = await fetch(`${API_BASE_URL}/stop/${id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
      // After stopping, immediately fetch the new status
      const newStatus = await fetchProcessStatus(id);
      setProcesses(prevProcesses =>
        prevProcesses.map(p =>
          p.id === id ? { ...p, status: newStatus } : p
        )
      );
    } catch (error) {
      console.error(`Error stopping ${id}:`, error);
      setProcesses(prevProcesses =>
        prevProcesses.map(p =>
          p.id === id ? { ...p, status: 'Failed to Stop' } : p
        )
      );
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Process Management Dashboard</h2>
      <div className="process-cards-container">
        {processes.map(process => (
          <ProcessCard
            key={process.id}
            name={process.name}
            status={process.status}
            onStart={() => startProcess(process.id)}
            onStop={() => stopProcess(process.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;