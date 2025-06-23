import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedApi, Configuration, User } from '../api';

const protectedApi = new ProtectedApi(new Configuration({
  basePath: 'http://localhost:3000',
}));

const SESSION_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    const now = Date.now();
    if (!token || !loginTime || now - parseInt(loginTime, 10) > SESSION_DURATION_MS) {
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('refresh_token');
      navigate('/login', { state: { error: 'Session expired. Please log in again.' } });
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await protectedApi.meRoute({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        // Try refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const refreshRes = await fetch('http://localhost:3000/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });
            if (refreshRes.ok) {
              const data = await refreshRes.json();
              localStorage.setItem('token', data.token);
              localStorage.setItem('loginTime', Date.now().toString());
              // Retry fetching user with new token
              const retryRes = await protectedApi.meRoute({
                headers: {
                  Authorization: `Bearer ${data.token}`,
                },
              });
              setUser(retryRes.data);
              return;
            }
          } catch (refreshErr) {
            // fall through to logout
          }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('refresh_token');
        navigate('/login', { state: { error: 'Session expired or unauthorized. Please log in again.' } });
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="profile-card" style={{ maxWidth: 400, margin: 'auto', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', background: '#fff' }}>
        <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>Profile</h2>
          <button onClick={handleLogout} className="btn btn-danger" style={{ fontWeight: 600, fontSize: 16, padding: '8px 24px' }}>
            Logout
          </button>
        </div>
        <div className="profile-info" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="info-group" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#888', fontWeight: 600, marginBottom: 4 }}>Email</div>
            <div style={{ fontSize: 18, color: '#222', fontWeight: 500 }}>{user.email}</div>
          </div>
          <div className="info-group" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#888', fontWeight: 600, marginBottom: 4 }}>User ID</div>
            <div style={{ fontSize: 18, color: '#222', fontWeight: 500 }}>{user.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 