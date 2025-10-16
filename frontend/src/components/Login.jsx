import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: formData.username,
        password: formData.password
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.user && response.data.token) {
        onLogin(response.data.user, response.data.token);
      } else {
        setErrorMessage('Invalid response received from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response) {
        setErrorMessage(error.response.data?.message || 'Authentication failed');
      } else if (error.request) {
        setErrorMessage('Unable to connect to server. Please check your connection.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          <div className="card-header">
            <div className="company-brand">
              <div className="brand-logo">
                <span className="logo-symbol">⏭️</span>
              </div>
              <h1 className="brand-name">Workflow Platform</h1>
            </div>
          </div>

          <div className="card-body">
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-field">
                <label htmlFor="username" className="field-label">
                  Username
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">👤</span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Enter your username"
                    className="form-control"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="password" className="field-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">🔒</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className="form-control"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="error-notification">
                  <span className="error-icon">⚠️</span>
                  {errorMessage}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className={`login-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="button-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;