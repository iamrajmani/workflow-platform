import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    department: '',
    role: 'USER'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // This would call your backend API to get users
      // For now, using mock data
      const mockUsers = [
        { id: 1, username: 'admin', name: 'System Administrator', email: 'admin@company.com', department: 'IT', role: 'ADMIN' },
        { id: 2, username: 'manager1', name: 'John Manager', email: 'john@company.com', department: 'Finance', role: 'MANAGER' },
        { id: 3, username: 'user1', name: 'Alice Johnson', email: 'alice@company.com', department: 'HR', role: 'USER' },
        { id: 4, username: 'user2', name: 'Bob Smith', email: 'bob@company.com', department: 'Engineering', role: 'USER' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    // Here you would call your backend API to create a user
    console.log('Creating user:', newUser);
    alert('User creation functionality would be implemented here');
    setShowCreateModal(false);
    setNewUser({
      username: '',
      password: '',
      name: '',
      email: '',
      department: '',
      role: 'USER'
    });
  };

  const departments = ['Engineering', 'Finance', 'HR', 'IT', 'Operations', 'Marketing', 'Sales'];
  const roles = ['USER', 'MANAGER', 'ADMIN'];

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      {/* Header */}
      <header className="user-management-header">
        <div className="header-content">
          <h1>User Management</h1>
          <div className="header-actions">
            <span className="user-role">{user.role}</span>
            <button onClick={onLogout} className="logout-button">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="user-management-main">
        {/* Action Bar */}
        <div className="action-bar">
          <button 
            className="primary-button"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New User
          </button>
          <div className="stats">
            <span>Total Users: {users.length}</span>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`department-badge ${user.department.toLowerCase()}`}>
                      {user.department}
                    </span>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Users Found</h3>
            <p>Get started by creating your first user</p>
            <button 
              className="primary-button"
              onClick={() => setShowCreateModal(true)}
            >
              Create First User
            </button>
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Create New User</h2>
              <button 
                className="close-button"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    required
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    required
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-button"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;