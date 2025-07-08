import React, { useEffect, useState } from 'react';
import { AdminService } from '../../api/apiService';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
           const response = await AdminService.getAllUsers();
      // if (!Array.isArray(response)) {
      //   throw new Error('Invalid users data format');
      // }
      const usersArray = Array.isArray(response) ? response : response.data || response.users || [];
      setUsers(usersArray);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await AdminService.deleteUser(id);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      setError(error.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-management-container">
      <h2 className="user-management-title">Users Management</h2>
      
      {users.length === 0 ? (
        <p className="no-users-message">No users available.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id.substring(0, 6)}...</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="action-button delete-button"
                    aria-label={`Delete user ${user.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}