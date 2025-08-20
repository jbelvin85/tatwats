import React, { useState, useEffect } from 'react';

function HelperAdmin() {
  const [helpers, setHelpers] = useState([]);
  const [newHelperName, setNewHelperName] = useState('');
  const [editingHelper, setEditingHelper] = useState(null);
  const [editedHelperName, setEditedHelperName] = useState('');

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/helpers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHelpers(data);
    } catch (error) {
      console.error("Error fetching helpers:", error);
    }
  };

  const handleAddHelper = async (e) => {
    e.preventDefault();
    if (!newHelperName.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/helpers', {
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
      const response = await fetch(`http://localhost:3001/api/helpers/${helperName}`, {
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
    setEditingHelper(helper);
    setEditedHelperName(helper);
  };

  const handleSaveEdit = async (originalName) => {
    if (!editedHelperName.trim() || originalName === editedHelperName) {
      setEditingHelper(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/helpers/${originalName}/${editedHelperName}`, {
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
      <h2>Helper Administration</h2>

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
        {helpers.map((helper) => (
          <li key={helper} className="helper-item">
            {editingHelper === helper ? (
              <>
                <input
                  type="text"
                  value={editedHelperName}
                  onChange={(e) => setEditedHelperName(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(helper)}>Save</button>
                <button onClick={() => setEditingHelper(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{helper}</span>
                <button onClick={() => handleEditClick(helper)}>Edit</button>
                <button onClick={() => handleDeleteHelper(helper)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HelperAdmin;