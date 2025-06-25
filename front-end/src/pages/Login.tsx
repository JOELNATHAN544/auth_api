import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthApi, Configuration } from '../api';
import styled, { keyframes } from 'styled-components';

const authApi = new AuthApi(new Configuration({ basePath: process.env.REACT_APP_API_URL }));

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

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: #58A6FF;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
  font-family: 'Inter', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: 600;
  color: #8B949E;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  background: rgba(13, 17, 23, 0.7);
  border: 1.5px solid #22262e;
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
  color: #fff;
  font-size: 1.1rem;
  font-family: inherit;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  &:focus {
    border: 1.5px solid #58A6FF;
    box-shadow: 0 0 0 2px #58A6FF33;
  }
`;

const Error = styled.div`
  color: #ff6b81;
  background: rgba(139, 92, 246, 0.08);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const glow = keyframes`
  0% { filter: brightness(1) drop-shadow(0 0 8px #58A6FF88); }
  50% { filter: brightness(1.2) drop-shadow(0 0 16px #8B5CF6cc); }
  100% { filter: brightness(1) drop-shadow(0 0 8px #58A6FF88); }
`;

const GradientButton = styled.button`
  width: 100%;
  padding: 1rem 0;
  border: none;
  border-radius: 12px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(90deg, #58A6FF 0%, #8B5CF6 100%);
  box-shadow: 0 2px 16px 0 #2DD4BF44;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: transform 0.15s, box-shadow 0.15s;
  animation: ${glow} 2.5s infinite;
  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 32px 0 #8B5CF6aa, 0 2px 16px 0 #2DD4BF44;
  }
`;

const AuthLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 1.2rem;
  color: #58A6FF;
  font-size: 1rem;
  text-decoration: none;
  opacity: 0.85;
  transition: color 0.2s, opacity 0.2s;
  &:hover {
    color: #2DD4BF;
    opacity: 1;
    text-decoration: underline;
  }
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.error) {
      setError(location.state.error);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('loginTime', Date.now().toString());
      navigate('/profile');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Background>
      {/* Soft glowing particles */}
      <Particle top="10%" left="5%" size="180px" color="#8B5CF6" />
      <Particle top="70%" left="80%" size="140px" color="#58A6FF" />
      <Particle top="50%" left="40%" size="120px" color="#2DD4BF" />
      <GlassCard>
        <div className="icon-above-heading">
          <svg width="100" height="100" viewBox="0 0 103 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="20" r="14" fill="#4A90E2" />
            <circle cx="71" cy="20" r="14" fill="#4A90E2" />
            <ellipse cx="51.5" cy="44.5" rx="34.5" ry="12.5" fill="#4A90E2" fillOpacity="0.7" />
          </svg>
        </div>
        <Title>Welcome Back</Title>
        <Form onSubmit={handleLogin}>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <Error>{error}</Error>}
          <GradientButton type="submit">Login</GradientButton>
        </Form>
        <AuthLink href="/register">Don't have an account? Register</AuthLink>
      </GlassCard>
    </Background>
  );
} 