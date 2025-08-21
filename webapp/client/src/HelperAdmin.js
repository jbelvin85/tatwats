import React, { useState, useEffect } from 'react';

function HelperAdmin() {
  const [helpers, setHelpers] = useState([]);
  const [newHelperName, setNewHelperName] = useState('');
  const [editingHelper, setEditingHelper] = useState(null);
  const [editedHelperName, setEditedHelperName] = useState('');
  const [loading, setLoading] = useState(true); // New loading state
  const [error, setError] = useState(null);     // New error state
  const [showDescription, setShowDescription] = useState({}); // State to manage description visibility

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    try {
      setLoading(true); // Set loading to true before fetch
      setError(null);   // Clear any previous errors
      const response = await fetch('/api/helpers'); // Use relative path due to proxy
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHelpers(data);
    } catch (error) {
      console.error("Error fetching helpers:", error);
      setError("Failed to load helpers. Please check the server and your network connection."); // Set user-friendly error message
    } finally {
      setLoading(false); // Set loading to false after fetch (success or failure)
    }
  };

  const handleAddHelper = async (e) => {
    e.preventDefault();
    if (!newHelperName.trim()) return;

    try {
      const response = await fetch('/api/helpers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newHelperName }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewHelperName('');
      fetchHelpers(); // Refresh the list
    } catch (error) {
      console.error("Error adding helper:", error);
    }
  };

  const handleDeleteHelper = async (helperName) => {
    try {
      const response = await fetch(`/api/helpers/${helperName}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchHelpers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting helper:", error);
    }
  };

  const handleEditClick = (helper) => {
    setEditingHelper(helper.name);
    setEditedHelperName(helper.name);
  };

  const handleSaveEdit = async (originalName) => {
    if (!editedHelperName.trim() || originalName === editedHelperName) {
      setEditingHelper(null);
      return;
    }

    try {
      const response = await fetch(`/api/helpers/${originalName}/${editedHelperName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingHelper(null);
      fetchHelpers(); // Refresh the list
    } catch (error) {
      console.error("Error editing helper:", error);
    }
  };

  return (
    <div className="helper-admin-container">

      {loading && <p>Loading helpers...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <form onSubmit={handleAddHelper} className="add-helper-form">
            <input
              type="text"
              placeholder="New Helper Name"
              value={newHelperName}
              onChange={(e) => setNewHelperName(e.target.value)}
            />
            <button type="submit">Add Helper</button>
          </form>

          <ul className="helper-list">
            {helpers.length === 0 ? (
              <p>No helpers found. Add one above!</p>
            ) : (
              helpers.map((helper) => (
                <li key={helper.name} className="helper-item">
                  {editingHelper === helper.name ? (
                    <>
                      <input
                        type="text"
                        value={editedHelperName}
                        onChange={(e) => setEditedHelperName(e.target.value)}
                      />
                      <button onClick={() => handleSaveEdit(helper.name)}>Save</button>
                      <button onClick={() => setEditingHelper(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span>{helper.name}</span>
                      <button onClick={() => handleEditClick(helper.name)}>Edit</button>
                      <button onClick={() => handleDeleteHelper(helper.name)}>Delete</button>
                      <button onClick={() => setShowDescription(prev => ({ ...prev, [helper.name]: !prev[helper.name] }))}>
                        {showDescription[helper.name] ? 'Hide Description' : 'Show Description'}
                      </button>
                    </>
                  )}
                  {showDescription[helper.name] && (
                    <div className="helper-description">
                      <pre>{helper.description}</pre>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}

export default HelperAdmin;
