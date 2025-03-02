import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API (using fetch instead of axios)
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleDelete = (userId) => {
    // Delete user (using fetch instead of axios)
    fetch(`/api/users/${userId}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          alert('User deleted successfully!');
          setUsers(users.filter(user => user.id !== userId));
        } else {
          alert('Failed to delete user.');
        }
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div>
      <h2>User Management</h2>
      <table style={{ width: '100%', border: '1px solid #ddd', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;