import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthApi, Configuration } from '../api';

const authApi = new AuthApi(new Configuration({ basePath: process.env.REACT_APP_API_URL }));

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container" style={{ position: 'relative' }}>
      {/* Decorative bubbles */}
      <div className="bubble bubble-top-left" />
      <div className="bubble bubble-bottom-right" />
      <div className="auth-card register-card">
        <div className="card-header-flex">
          <h2 className="auth-title">Create Account</h2>
          <span className="profile-icon-inline">
            <svg width="48" height="48" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="26" r="12" fill="#2DD4BF" />
              <circle cx="46" cy="26" r="12" fill="#8B5CF6" />
              <ellipse cx="35" cy="52" rx="22" ry="12" fill="#2DD4BF" fillOpacity="0.7" />
            </svg>
          </span>
        </div>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              className="form-input"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              className="form-input"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Choose a password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block">
            Register
          </button>
        </form>
        <a href="/login" className="auth-link">
          Already have an account? Login
        </a>
      </div>
    </div>
  );
} 