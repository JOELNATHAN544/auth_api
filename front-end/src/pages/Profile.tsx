import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedApi, Configuration, User } from '../api';

const protectedApi = new ProtectedApi(new Configuration({
  basePath: process.env.REACT_APP_API_URL,
}));

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token') || '';
      try {
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
      <div className="profile-icon-container">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="26" r="12" fill="#8B5CF6" />
          <circle cx="46" cy="26" r="12" fill="#58A6FF" />
          <ellipse cx="35" cy="52" rx="22" ry="12" fill="#8B5CF6" fillOpacity="0.7" />
        </svg>
      </div>
      <button className="btn btn-primary logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <div className="auth-card profile-card">
        <h2 className="auth-title">Profile</h2>
        {error && <div className="error-message">{error}</div>}
        {user ? (
          <div className="profile-info-boxes">
            <div className="profile-info-box">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>
            <div className="profile-info-box">
              <span className="profile-label">First Name</span>
              <span className="profile-value">{user.first_name || <span className="profile-missing">(not set)</span>}</span>
            </div>
            <div className="profile-info-box">
              <span className="profile-label">Last Name</span>
              <span className="profile-value">{user.last_name || <span className="profile-missing">(not set)</span>}</span>
            </div>
            <div className="profile-info-box">
              <span className="profile-label">User ID</span>
              <span className="profile-value">{user.id}</span>
            </div>
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
// .profile-info-boxes {
//   display: flex;
//   flex-direction: column;
//   gap: 1.2rem;
//   margin-top: 32px;
// }
// .profile-info-box {
//   background: rgba(30, 41, 59, 0.85);
//   border-radius: 12px;
//   padding: 1.1rem 1.5rem;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
//   box-shadow: 0 2px 12px 0 #2DD4BF22;
// }
// .profile-label {
//   color: #94a3b8;
//   font-size: 1.1rem;
//   font-weight: 600;
// }
// .profile-value {
//   color: #fff;
//   font-size: 1.15rem;
//   font-weight: 700;
// }
// .profile-missing {
//   color: #ff6b6b;
//   font-size: 1rem;
//   font-style: italic;
// } 