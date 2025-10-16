import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const getDashboardLink = () => {
    switch (user.role) {
      case 'ADMIN': return '/admin';
      case 'MANAGER': return '/manager';
      case 'USER': return '/user';
      default: return '/dashboard';
    }
  };

  const getRoleFeatures = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          { 
            title: "User Management", 
            description: "Create and manage user accounts and departments", 
            icon: "👥",
            path: "/admin/users",
            color: "blue"
          },
          { 
            title: "System Analytics", 
            description: "View comprehensive reports and performance metrics", 
            icon: "📊",
            path: "/analytics",
            color: "purple"
          },
          { 
            title: "Department Overview", 
            description: "Monitor workflow activity across all departments", 
            icon: "🏢",
            path: "/admin/departments",
            color: "green"
          }
        ];
      case 'MANAGER':
        return [
          { 
            title: "Pending Approvals", 
            description: "Review and approve team workflow requests", 
            icon: "✅",
            path: "/manager/pending",
            color: "orange"
          },
          { 
            title: "AI Insights", 
            description: "Get intelligent approval recommendations", 
            icon: "🤖",
            path: "/manager/insights",
            color: "blue"
          },
          { 
            title: "Team Overview", 
            description: "Monitor your team's workflow activity", 
            icon: "👨‍💼",
            path: "/manager/team",
            color: "purple"
          }
        ];
      case 'USER':
        return [
          { 
            title: "Submit Request", 
            description: "Create new workflow requests and applications", 
            icon: "📝",
            path: "/user",
            color: "green"
          },
          { 
            title: "Track Status", 
            description: "Monitor your submitted workflow progress", 
            icon: "📋",
            path: "/user",
            color: "blue"
          },
          { 
            title: "Request History", 
            description: "View your complete workflow history", 
            icon: "🕒",
            path: "/user",
            color: "purple"
          }
        ];
      default:
        return [];
    }
  };

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="logo">
              <span className="logo-icon">⚡</span>
              <h1 className="brand-name">WorkflowPro</h1>
            </div>
          </div>
          
          <div className="user-section">
            <div className="user-info">
              <span className="user-role">{user.role}</span>
            </div>
            <div className="header-actions">
              <Link to={getDashboardLink()} className="dashboard-link">
                Go to Dashboard
              </Link>
              <button onClick={onLogout} className="logout-button">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Quick Actions */}
        <section className="actions-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>

          <div className="actions-grid">
            {/* Main Dashboard Card */}
            <div 
              className="action-card primary-card"
              onClick={() => handleActionClick(getDashboardLink())}
            >
              <div className="card-icon primary">🚀</div>
              <div className="card-content">
                <h3 className="card-title">Go to Dashboard</h3>
                <p className="card-description">
                  Access your complete dashboard with all role-specific features and tools
                </p>
              </div>
              <div className="card-arrow">→</div>
            </div>

            {/* Role-specific Cards */}
            {getRoleFeatures().map((feature, index) => (
              <div
                key={index}
                className={`action-card feature-card ${feature.color}`}
                onClick={() => handleActionClick(feature.path)}
              >
                <div className="card-icon">{feature.icon}</div>
                <div className="card-content">
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-description">{feature.description}</p>
                </div>
                <div className="card-arrow">→</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;