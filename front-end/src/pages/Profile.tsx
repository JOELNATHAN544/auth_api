import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedApi, Configuration, User } from '../api';
import styled, { keyframes } from 'styled-components';

const protectedApi = new ProtectedApi(new Configuration({
  basePath: process.env.REACT_APP_API_URL,
  accessToken: localStorage.getItem('token') || '',
}));

const SESSION_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// --- Styled Components ---
const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #0D1117 60%, #161B22 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const GlassCard = styled.div`
  background: rgba(22, 27, 34, 0.85);
  box-shadow: 0 8px 32px 0 rgba(8, 16, 32, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1.5px solid rgba(88, 166, 255, 0.12);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 400px;
  width: 100%;
  z-index: 2;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  margin: 0;
  font-weight: 800;
  font-size: 2rem;
  color: #58A6FF;
  letter-spacing: -1px;
  font-family: 'Inter', sans-serif;
`;

const glow = keyframes`
  0% { filter: brightness(1) drop-shadow(0 0 8px #58A6FF88); }
  50% { filter: brightness(1.2) drop-shadow(0 0 16px #8B5CF6cc); }
  100% { filter: brightness(1) drop-shadow(0 0 8px #58A6FF88); }
`;

const GradientButton = styled.button`
  font-weight: 700;
  font-size: 1rem;
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(90deg, #58A6FF 0%, #8B5CF6 100%);
  box-shadow: 0 2px 16px 0 #2DD4BF44;
  cursor: pointer;
  animation: ${glow} 2.5s infinite;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 32px 0 #8B5CF6aa, 0 2px 16px 0 #2DD4BF44;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 0.7rem;
`;

const InfoLabel = styled.div`
  font-size: 0.95rem;
  color: #8B949E;
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const InfoValue = styled.div`
  font-size: 1.2rem;
  color: #fff;
  font-weight: 600;
`;

const Loading = styled.div`
  color: #8B5CF6;
  font-size: 1.3rem;
  text-align: center;
  font-weight: 700;
  padding: 2rem 0;
`;

// Soft blurred glowing background shapes
const Particle = styled.div<{top: string, left: string, size: string, color: string}>`
  position: absolute;
  top: ${p => p.top};
  left: ${p => p.left};
  width: ${p => p.size};
  height: ${p => p.size};
  background: ${p => p.color};
  filter: blur(32px);
  opacity: 0.35;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
`;

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
            const refreshRes = await fetch(`${process.env.REACT_APP_API_URL}/refresh`, {
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
      <Background>
        <Particle top="10%" left="5%" size="180px" color="#8B5CF6" />
        <Particle top="70%" left="80%" size="140px" color="#58A6FF" />
        <Particle top="50%" left="40%" size="120px" color="#2DD4BF" />
        <GlassCard>
          <Loading>Loading...</Loading>
        </GlassCard>
      </Background>
    );
  }

  return (
    <Background>
      <Particle top="10%" left="5%" size="180px" color="#8B5CF6" />
      <Particle top="70%" left="80%" size="140px" color="#58A6FF" />
      <Particle top="50%" left="40%" size="120px" color="#2DD4BF" />
      <GlassCard>
        <Header>
          <Title>Profile</Title>
          <GradientButton onClick={handleLogout}>Logout</GradientButton>
        </Header>
        <Info>
          <InfoGroup>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoGroup>
          <InfoGroup>
            <InfoLabel>User ID</InfoLabel>
            <InfoValue>{user.id}</InfoValue>
          </InfoGroup>
        </Info>
      </GlassCard>
    </Background>
  );
} 