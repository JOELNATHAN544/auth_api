import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthApi, Configuration } from '../api';
import styled, { keyframes } from 'styled-components';

console.log('API Base Path:', process.env.REACT_APP_API_URL);
const authApi = new AuthApi(new Configuration({ basePath: process.env.REACT_APP_API_URL }));

export default function Register() {
  console.log("Register component rendered");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form submitted");
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
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Background>
      {/* Soft glowing particles */}
      <Particle top="10%" left="5%" size="180px" color="#8B5CF6" />
      <Particle top="70%" left="80%" size="140px" color="#58A6FF" />
      <Particle top="50%" left="40%" size="120px" color="#2DD4BF" />
      <GlassCard>
        <Title>Create Account</Title>
        <Form onSubmit={handleRegister}>
          <div>
            <Label>First Name</Label>
            <Input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
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
              placeholder="Choose a password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </Form>
        <a href="/login" className="auth-link">
          Already have an account? Login
        </a>
      </GlassCard>
    </Background>
  );
}

// --- Styled Components ---
const Background = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ParticleProps {
  top: string;
  left: string;
  size: string;
  color: string;
}

const Particle = styled.div<ParticleProps>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => props.color};
  border-radius: 50%;
  opacity: 0.25;
  filter: blur(24px);
  z-index: 0;
`;

const GlassCard = styled.div``;
const Title = styled.h2``;
const Form = styled.form``;
const Label = styled.label``;
const Input = styled.input``; 