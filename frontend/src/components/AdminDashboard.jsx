import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState('users');
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    department: 'Engineering'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching admin data...');
      
      const [usersRes, workflowsRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/users'),
        axios.get('http://localhost:8080/api/workflows'),
        axios.get('http://localhost:8080/api/workflows/analytics')
      ]);
      
      console.log('✅ Data fetched:', {
        users: usersRes.data,
        workflows: workflowsRes.data,
        analytics: analyticsRes.data
      });
      
      setUsers(usersRes.data);
      setWorkflows(workflowsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      alert('Failed to load data: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('👤 Creating new user:', newUser);
      
      const response = await axios.post('http://localhost:8080/api/auth/register', newUser);
      console.log('✅ User created:', response.data);
      
      setShowUserModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'USER', department: 'Engineering' });
      await fetchData(); // Refresh data
      
      alert('User created successfully!');
    } catch (error) {
      console.error('❌ Error creating user:', error);
      alert('Failed to create user: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'PENDING': return 'status-pending';
      case 'REVIEW': return 'status-review';
      default: return 'status-pending';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'role-admin';
      case 'MANAGER': return 'role-manager';
      case 'USER': return 'role-user';
      default: return 'role-user';
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <div className="nav-brand">Admin Dashboard</div>
        <div className="nav-items">
          <span className="user-info">Welcome, {user.username} ({user.role})</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Analytics Overview */}
        <div className="analytics-section">
          <h2>📊 System Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>Total Workflows</h3>
                <p>{analytics.totalWorkflows || 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>Pending Approvals</h3>
                <p>{analytics.pendingWorkflows || 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>Approved</h3>
                <p>{workflows.filter(w => w.status === 'APPROVED').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 User Management
            </button>
            <button 
              className={`tab ${activeTab === 'workflows' ? 'active' : ''}`}
              onClick={() => setActiveTab('workflows')}
            >
              📋 All Workflows
            </button>
            <button 
              className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {loading && (
            <div className="loading">Loading...</div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h3>User Management</h3>
                <button 
                  className="btn-primary"
                  onClick={() => setShowUserModal(true)}
                  disabled={loading}
                >
                  ➕ Add New User
                </button>
              </div>
              
              <div className="users-grid">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-header">
                      <h4>{user.username}</h4>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="user-details">
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Department:</strong> {user.department}</p>
                      <p><strong>User ID:</strong> {user.id}</p>
                    </div>
                  </div>
                ))}
              </div>

              {users.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No Users Found</h3>
                  <p>Get started by creating the first user</p>
                </div>
              )}
            </div>
          )}

          {/* Workflows Tab */}
          {activeTab === 'workflows' && (
            <div className="workflows-section">
              <div className="section-header">
                <h3>All Workflows</h3>
                <div className="workflow-stats">
                  <span>Total: {workflows.length}</span>
                  <span>Pending: {workflows.filter(w => w.status === 'PENDING').length}</span>
                </div>
              </div>
              
              <div className="workflows-table-container">
                <table className="workflows-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Submitted By</th>
                      <th>Department</th>
                      <th>Amount</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map(workflow => (
                      <tr key={workflow.id}>
                        <td className="workflow-title">{workflow.title}</td>
                        <td>
                          <span className="type-badge">{workflow.type}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(workflow.status)}`}>
                            {workflow.status}
                          </span>
                        </td>
                        <td>{workflow.submittedBy?.username || 'N/A'}</td>
                        <td>{workflow.department}</td>
                        <td>${workflow.amount || 0}</td>
                        <td>{new Date(workflow.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {workflows.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No Workflows Found</h3>
                  <p>No workflows have been created yet</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="analytics-detail-section">
              <div className="section-header">
                <h3>Detailed Analytics</h3>
              </div>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h4>Workflows by Type</h4>
                  <div className="analytics-list">
                    {analytics.byType && analytics.byType.map(([type, count]) => (
                      <div key={type} className="analytics-item">
                        <span className="label">{type}</span>
                        <span className="value">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h4>Workflows by Status</h4>
                  <div className="analytics-list">
                    {analytics.byStatus && analytics.byStatus.map(([status, count]) => (
                      <div key={status} className="analytics-item">
                        <span className="label">{status}</span>
                        <span className="value">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h4>Users by Role</h4>
                  <div className="analytics-list">
                    {users.reduce((acc, user) => {
                      acc[user.role] = (acc[user.role] || 0) + 1;
                      return acc;
                    }, {}) && Object.entries(users.reduce((acc, user) => {
                      acc[user.role] = (acc[user.role] || 0) + 1;
                      return acc;
                    }, {})).map(([role, count]) => (
                      <div key={role} className="analytics-item">
                        <span className="label">{role}</span>
                        <span className="value">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New User</h3>
            <form onSubmit={createUser}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  disabled={loading}
                >
                  <option value="USER">User</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Department *</label>
                <select
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  disabled={loading}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowUserModal(false)}
                  disabled={loading}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;