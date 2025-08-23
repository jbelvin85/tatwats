import React, { useState, useEffect, useCallback } from 'react';
import './HelperAdmin.css';

const API_URL = '/api/helpers';

// A reusable form for both creating and editing helpers
const HelperForm = ({ helper, onSave, onCancel, formError }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    command: '',
    core_args: '[]',
    user_args: '[]',
    cwd: ''
  });

  useEffect(() => {
    if (helper) {
      setFormData({
        ...helper,
        core_args: JSON.stringify(helper.core_args || [], null, 2),
        user_args: JSON.stringify(helper.user_args || [], null, 2)
      });
    } else {
      // Reset for new helper form
      setFormData({ id: '', name: '', description: '', command: '', core_args: '[]', user_args: '[]', cwd: '' });
    }
  }, [helper]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedCoreArgs = JSON.parse(formData.core_args);
      const parsedUserArgs = JSON.parse(formData.user_args);
      onSave({ ...formData, core_args: parsedCoreArgs, user_args: parsedUserArgs });
    } catch (error) {
      onSave(null, 'Error: "Core Directives" and "User Directives" fields must contain valid JSON arrays.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="helper-form-container">
      <label>ID:</label>
      <input name="id" value={formData.id} onChange={handleChange} placeholder="ID (e.g., 'the_architect')" required disabled={!!helper} />
      <label>Name:</label>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name (e.g., 'The Architect')" required />
      <label>Description:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <label>Command:</label>
      <input name="command" value={formData.command} onChange={handleChange} placeholder="Command (e.g., 'node')" required />
      
      {/* Display core_args as read-only */}
      <label>Core Directives (Read-Only):</label>
      <textarea name="core_args" value={formData.core_args} readOnly disabled />

      {/* Allow editing user_args */}
      <label>User Directives (Editable):</label>
      <textarea name="user_args" value={formData.user_args} onChange={handleChange} placeholder='User Directives (JSON array, e.g., ["--verbose"])' />
      
      <label>Working Directory:</label>
      <input name="cwd" value={formData.cwd} onChange={handleChange} placeholder="Working Directory (e.g., 'helpers/the_architect')" required />
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
        {formError && <p className="form-error">{formError}</p>}
      </div>
    </form>
  );
};

function HelperAdmin() {
  const [helpers, setHelpers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState(null); // null for new, object for edit
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null); // For page-level errors
  const [formError, setFormError] = useState(null); // For form-specific errors

  const fetchHelpers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHelpers(data);
    } catch (e) {
      setPageError(`Failed to load helpers: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHelpers();
  }, [fetchHelpers]);

  const handleSave = async (helperData, error) => {
    setFormError(null); // Clear previous errors
    if (error) {
      setFormError(error);
      return;
    }

    const isNew = !selectedHelper;
    const url = isNew ? API_URL : `${API_URL}/${helperData.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(helperData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setIsFormOpen(false); // Close form modal
      setSelectedHelper(null);
      fetchHelpers(); // Refresh list
    } catch (e) {
      setFormError(`Failed to save helper: ${e.message}`);
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
        setPageError(`Failed to delete helper: ${e.message}`); // Show as page error
      }
    }
  };

  const handleAddNew = () => {
    setSelectedHelper(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleEdit = (helper) => {
    setSelectedHelper(helper);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedHelper(null);
    setFormError(null);
  };

  return (
    <div className="helper-admin-container">
      <h2>Helpers Management</h2>
      {loading && <p>Loading...</p>}
      {pageError && <p className="page-error">{pageError}</p>}
      
      {!loading && !pageError && (
        <>
          <div className="toolbar">
            <button onClick={handleAddNew}>Add New Helper</button>
          </div>

          <table className="helpers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Description</th>
                <th>Command</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {helpers.map((helper) => (
                <tr key={helper.id}>
                  <td>{helper.name}</td>
                  <td>{helper.id}</td>
                  <td>{helper.description}</td>
                  <td>{`${helper.command} ${helper.core_args.join(' ')} ${helper.user_args.join(' ')}`}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleEdit(helper)}>Edit</button>
                    <button onClick={() => handleDelete(helper.id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isFormOpen && (
            <div className="modal-backdrop">
              <div className="modal-content">
                <h3>{selectedHelper ? 'Edit Helper' : 'Add New Helper'}</h3>
                <HelperForm helper={selectedHelper} onSave={handleSave} onCancel={handleCancel} formError={formError} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HelperAdmin;