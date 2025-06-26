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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="20" r="13" fill="#4A90E2"/>
            <circle cx="70" cy="20" r="13" fill="#4A90E2"/>
            <ellipse cx="30" cy="45" rx="20" ry="10" fill="#4A90E2"/>
            <ellipse cx="70" cy="45" rx="20" ry="10" fill="#4A90E2"/>
          </svg>
        </div>
        <h2 className="auth-title">Create Account</h2>
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
              autoComplete="email"
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
              autoComplete="new-password"
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