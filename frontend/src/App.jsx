import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import UserDashboard from './components/UserDashboard';
import Analytics from './analytics/Analytics';
import UserManagement from './components/UserManagement'; // Add this import

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="loading">Loading Workflow Platform...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user && user.role === 'ADMIN' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/manager" 
            element={user && user.role === 'MANAGER' ? <ManagerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/user" 
            element={user && user.role === 'USER' ? <UserDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/analytics" 
            element={user ? <Analytics user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          {/* Add UserManagement route */}
          <Route 
            path="/admin/users" 
            element={user && user.role === 'ADMIN' ? <UserManagement user={user} onLogout={handleLogout} /> : <Navigate to="/dashboard" />} 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;