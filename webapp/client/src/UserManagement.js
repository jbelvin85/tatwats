import React, { useState, useEffect, useCallback } from 'react';

const API_URL = '/api/users';

// Reusable Form for creating/editing users
const UserForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: 'user',
    });

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, role: user.role || 'user' });
        } else {
            setFormData({ name: '', role: 'user' });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <label>Name:</label>
            <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="User's name"
                required
            />
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // null for new, object for edit

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setUsers(data);
        } catch (e) {
            setError(`Failed to load users: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSave = async (userData) => {
        const isNew = !selectedUser;
        const url = isNew ? API_URL : `${API_URL}/${selectedUser.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            setIsModalOpen(false);
            setSelectedUser(null);
            fetchUsers(); // Refresh the list
        } catch (e) {
            setError(`Failed to save user: ${e.message}`);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
                if (!response.ok && response.status !== 204) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                fetchUsers(); // Refresh the list
            } catch (e) {
                setError(`Failed to delete user: ${e.message}`);
            }
        }
    };

    const openModalForNew = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="user-management-container">
            <h2>User Management</h2>
            {error && <p className="page-error" style={{ color: 'red' }}>{error}</p>}
            
            <div className="toolbar">
                <button onClick={openModalForNew}>Add New User</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td className="actions-cell">
                                <button onClick={() => openModalForEdit(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.id)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>{selectedUser ? 'Edit User' : 'Add New User'}</h3>
                        <UserForm user={selectedUser} onSave={handleSave} onCancel={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;