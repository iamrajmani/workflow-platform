import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = ({ user, onLogout }) => {
  const [workflows, setWorkflows] = useState([]);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    title: '',
    description: '',
    type: 'LEAVE',
    amount: ''
  });

  useEffect(() => {
    loadUserWorkflows();
  }, [user]);

  const loadUserWorkflows = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8080/api/workflows/user/${user.username}`);
      setWorkflows(response.data);
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkflowSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const workflowData = {
        title: newWorkflow.title,
        description: newWorkflow.description,
        type: newWorkflow.type,
        amount: newWorkflow.amount ? parseFloat(newWorkflow.amount) : 0
      };
      
      await axios.post(
        `http://localhost:8080/api/workflows/${user.username}`, 
        workflowData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      setShowWorkflowModal(false);
      setNewWorkflow({ title: '', description: '', type: 'LEAVE', amount: '' });
      await loadUserWorkflows();
      
    } catch (error) {
      console.error('Error creating workflow:', error);
      let errorMessage = 'Failed to create workflow. ';
      
      if (error.response) {
        errorMessage += error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'Cannot connect to server. Please try again.';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'PENDING': return 'status-pending';
      case 'REVIEW': return 'status-review';
      default: return 'status-pending';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'LEAVE': return '🏖️';
      case 'PURCHASE': return '🛒';
      case 'BUDGET': return '💰';
      case 'PROJECT': return '📋';
      default: return '📄';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="brand-title">Workflow Dashboard</h1>
            <p className="user-greeting">Welcome back, {user.name || user.username}</p>
          </div>
          <div className="header-actions">
            <button 
              className="primary-button"
              onClick={() => setShowWorkflowModal(true)}
              disabled={isCreating}
            >
              Create New Request
            </button>
            <button 
              onClick={onLogout}
              className="logout-button"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">My Requests</h2>
            <p className="section-description">
              Track and manage your workflow submissions
            </p>
          </div>

          {isLoading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your requests...</p>
            </div>
          )}

          <div className="workflows-container">
            {workflows.map(workflow => (
              <div key={workflow.id} className="workflow-card">
                <div className="card-header">
                  <div className="request-type">
                    <span className="type-icon">{getTypeIcon(workflow.type)}</span>
                    <span className="type-label">{workflow.type}</span>
                  </div>
                  <span className={`status-indicator ${getStatusStyle(workflow.status)}`}>
                    {workflow.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <h3 className="request-title">{workflow.title}</h3>
                  <p className="request-description">{workflow.description}</p>
                  
                  <div className="request-details">
                    {workflow.amount > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Amount:</span>
                        <span className="detail-value">{formatCurrency(workflow.amount)}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="detail-label">Submitted:</span>
                      <span className="detail-value">{formatDate(workflow.createdAt)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{workflow.department}</span>
                    </div>
                    {workflow.approvedBy && (
                      <div className="detail-row">
                        <span className="detail-label">Approved By:</span>
                        <span className="detail-value">{workflow.approvedBy.username}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {workflows.length === 0 && !isLoading && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No Requests Found</h3>
              <p className="empty-description">
                You haven't created any workflow requests yet
              </p>
              <button 
                className="primary-button"
                onClick={() => setShowWorkflowModal(true)}
              >
                Create Your First Request
              </button>
            </div>
          )}
        </div>
      </main>

      {showWorkflowModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Create New Request</h2>
              <button 
                className="close-button"
                onClick={() => setShowWorkflowModal(false)}
                disabled={isCreating}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleWorkflowSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Request Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter a descriptive title"
                  value={newWorkflow.title}
                  onChange={(e) => setNewWorkflow({...newWorkflow, title: e.target.value})}
                  required
                  disabled={isCreating}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Provide details about your request"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                  required
                  disabled={isCreating}
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Request Type</label>
                  <select
                    className="form-select"
                    value={newWorkflow.type}
                    onChange={(e) => setNewWorkflow({...newWorkflow, type: e.target.value})}
                    disabled={isCreating}
                  >
                    <option value="LEAVE">Leave Request</option>
                    <option value="PURCHASE">Purchase Order</option>
                    <option value="BUDGET">Budget Request</option>
                    <option value="PROJECT">Project Approval</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Amount (Optional)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0.00"
                    value={newWorkflow.amount}
                    onChange={(e) => setNewWorkflow({...newWorkflow, amount: e.target.value})}
                    disabled={isCreating}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={() => setShowWorkflowModal(false)} 
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-button"
                  disabled={isCreating} 
                >
                  {isCreating ? (
                    <>
                      <span className="button-spinner"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;