import React, { useState, useEffect, useCallback } from 'react';

const API_URL = '/api/helpers';

// A reusable form for both creating and editing helpers
const HelperForm = ({ helper, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    command: '',
    args: '[]', // Store args as a JSON string in the form
    cwd: ''
  });

  useEffect(() => {
    if (helper) {
      setFormData({
        ...helper,
        args: JSON.stringify(helper.args || [], null, 2) // Pretty print JSON for editing
      });
    } else {
      // Reset for new helper form
      setFormData({ id: '', name: '', description: '', command: '', args: '[]', cwd: '' });
    }
  }, [helper]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Validate and parse the JSON arguments before saving
      const parsedArgs = JSON.parse(formData.args);
      onSave({ ...formData, args: parsedArgs });
    } catch (error) {
      alert('Error: "Args" field must contain valid JSON.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="helper-form">
      <input name="id" value={formData.id} onChange={handleChange} placeholder="ID (e.g., 'the_architect')" required disabled={!!helper} />
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name (e.g., 'The Architect')" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <input name="command" value={formData.command} onChange={handleChange} placeholder="Command (e.g., 'node')" required />
      <textarea name="args" value={formData.args} onChange={handleChange} placeholder='Args (JSON array, e.g., ["script.js"])' required />
      <input name="cwd" value={formData.cwd} onChange={handleChange} placeholder="Working Directory (e.g., 'helpers/the_architect')" required />
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

function HelperAdmin() {
  const [helpers, setHelpers] = useState([]);
  const [editingHelper, setEditingHelper] = useState(null); // Can be a helper object or `true` for a new one
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHelpers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHelpers(data);
    } catch (e) {
      setError(`Failed to load helpers: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHelpers();
  }, [fetchHelpers]);

  const handleSave = async (helperData) => {
    const isNew = !helperData.id || !helpers.some(h => h.id === helperData.id);
    const url = isNew ? API_URL : `${API_URL}/${helperData.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(helperData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setEditingHelper(null);
      fetchHelpers(); // Refresh list
    } catch (e) {
      alert(`Failed to save helper: ${e.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete helper "${id}"?`)) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok && response.status !== 204) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchHelpers(); // Refresh list
      } catch (e) {
        alert(`Failed to delete helper: ${e.message}`);
      }
    }
  };

  return (
    <div className="helper-admin-container">
      <h2>Helpers Management</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && (
        <>
          {editingHelper ? (
            <HelperForm 
              helper={editingHelper === true ? null : editingHelper} 
              onSave={handleSave} 
              onCancel={() => setEditingHelper(null)} 
            />
          ) : (
            <button onClick={() => setEditingHelper(true)}>Add New Helper</button>
          )}

          <ul className="helper-list">
            {helpers.map((helper) => (
              <li key={helper.id} className="helper-item">
                <span><strong>{helper.name}</strong> ({helper.id})</span>
                <div className="item-actions">
                  <button onClick={() => setEditingHelper(helper)}>Edit</button>
                  <button onClick={() => handleDelete(helper.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default HelperAdmin;