import React, { useState, useEffect, useCallback } from 'react';
import ProcessCard from './ProcessCard';
import './Dashboard.css';

const Dashboard = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api/processes';

  // Effect to fetch the initial list of processes
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Initialize processes with an 'Unknown' status
        const initialProcesses = data.map(p => ({ ...p, status: 'Unknown' }));
        setProcesses(initialProcesses);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch processes:", e);
        setError('Could not load processes. Is the backend server running?');
        setProcesses([]); // Clear any stale data
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
  }, []); // Runs only once on component mount

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
    if (processes.length === 0) return; // Don't run if there are no processes
    
    const promises = processes.map(async (p) => {
      const status = await fetchProcessStatus(p.id);
      return { ...p, status };
    });
    const newProcesses = await Promise.all(promises);
    setProcesses(newProcesses);
  }, [processes, fetchProcessStatus]);

  // Effect to periodically update statuses
  useEffect(() => {
    // Don't start the interval until the initial process list is loaded
    if (!loading && processes.length > 0) {
      updateAllProcessStatuses(); // Initial status check
      const interval = setInterval(updateAllProcessStatuses, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [loading, processes, updateAllProcessStatuses]);

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
      {loading && <p>Loading processes...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
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
      )}
    </div>
  );
};

export default Dashboard;