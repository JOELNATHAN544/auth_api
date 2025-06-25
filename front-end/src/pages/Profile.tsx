import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedApi, Configuration, User } from '../api';

const protectedApi = new ProtectedApi(new Configuration({
  basePath: process.env.REACT_APP_API_URL,
  accessToken: localStorage.getItem('token') || '',
}));

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await protectedApi.meRoute({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError('Failed to fetch user info.');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <button className="btn btn-primary logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <div className="auth-card profile-card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="20" r="13" fill="#4A90E2"/>
            <circle cx="70" cy="20" r="13" fill="#4A90E2"/>
            <ellipse cx="30" cy="45" rx="20" ry="10" fill="#4A90E2"/>
            <ellipse cx="70" cy="45" rx="20" ry="10" fill="#4A90E2"/>
          </svg>
        </div>
        <h2 className="auth-title">Profile</h2>
        {error && <div className="error-message">{error}</div>}
        {user ? (
          <div className="profile-info">
            <div><span className="profile-label">Email:</span> <span className="profile-value">{user.email}</span></div>
            <div><span className="profile-label">User ID:</span> <span className="profile-value">{user.id}</span></div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

// Add this to your CSS (index.css or Profile.module.css):
// .logout-btn {
//   position: fixed;
//   top: 32px;
//   right: 48px;
//   z-index: 10;
// }
// .profile-card {
//   min-width: 400px;
//   min-height: 350px;
// }
// .profile-info {
//   margin-top: 32px;
//   font-size: 1.2rem;
// }
// .profile-label {
//   color: #94a3b8;
//   margin-right: 8px;
// }
// .profile-value {
//   color: #fff;
//   font-weight: 500;
// } 