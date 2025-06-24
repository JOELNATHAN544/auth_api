import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Styled Components ---
const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #0D1117 60%, #161B22 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
`;

const Hero = styled.section`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 7rem 2rem 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;
  z-index: 2;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Headline = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -2px;
  line-height: 1.1;
  margin-bottom: 1.2rem;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(90deg, #58A6FF 0%, #8B5CF6 60%, #2DD4BF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeIn} 1.2s cubic-bezier(.4,0,.2,1);
`;

const Typewriter = styled.span`
  border-right: 2.5px solid #8B5CF6;
  padding-right: 0.2em;
  animation: blink 0.8s steps(1) infinite;
  @keyframes blink {
    0%, 100% { border-color: #8B5CF6; }
    50% { border-color: transparent; }
  }
`;

const Subheadline = styled.h2`
  font-size: 1.45rem;
  font-weight: 500;
  color: #8B949E;
  margin-bottom: 2.2rem;
  max-width: 600px;
  animation: ${fadeIn} 1.8s 0.3s cubic-bezier(.4,0,.2,1) backwards;
`;

const GlassPanel = styled.div`
  background: rgba(22, 27, 34, 0.85);
  box-shadow: 0 8px 32px 0 rgba(8, 16, 32, 0.37);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 18px;
  border: 1.5px solid rgba(88, 166, 255, 0.12);
  padding: 2rem 2.5rem;
  max-width: 520px;
  width: 100%;
  margin-top: 1.5rem;
  z-index: 2;
`;

const CodeSnippet = styled.pre`
  background: linear-gradient(100deg, #161B22 80%, #0D1117 100%);
  color: #58A6FF;
  font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 1.1rem;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  margin: 0;
  box-shadow: 0 2px 16px 0 #2DD4BF22;
  overflow-x: auto;
`;

const glow = keyframes`
  0% { filter: brightness(1) drop-shadow(0 0 8px #58A6FF88); }
  50% { filter: brightness(1.2) drop-shadow(0 0 16px #8B5CF6cc); }
  100% { filter: brightness(1) drop-shadow(0 0 8px #58A6FF88); }
`;

const GradientButton = styled.a`
  display: inline-block;
  padding: 1.1rem 2.5rem;
  border-radius: 14px;
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(90deg, #58A6FF 0%, #8B5CF6 100%);
  box-shadow: 0 2px 16px 0 #2DD4BF44;
  cursor: pointer;
  margin-top: 1.5rem;
  text-decoration: none;
  animation: ${glow} 2.5s infinite;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 4px 32px 0 #8B5CF6aa, 0 2px 16px 0 #2DD4BF44;
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
  filter: blur(40px);
  opacity: 0.28;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
`;

const Footer = styled.footer`
  width: 100%;
  background: #0D1117;
  padding: 2.5rem 0 1.2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  z-index: 2;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2.2rem;
  margin-bottom: 0.5rem;
`;

const FooterLink = styled.a`
  color: #8B949E;
  font-size: 1.05rem;
  text-decoration: none;
  opacity: 0.7;
  transition: color 0.2s, opacity 0.2s;
  &:hover {
    color: #58A6FF;
    opacity: 1;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.2rem;
`;

const SocialIcon = styled.a`
  color: #58A6FF;
  opacity: 0.7;
  font-size: 1.5rem;
  transition: color 0.2s, opacity 0.2s;
  &:hover {
    color: #2DD4BF;
    opacity: 1;
  }
`;

// --- Typewriter Effect ---
const useTypewriter = (text: string, speed = 40) => {
  const [displayed, setDisplayed] = useState('');
  const i = useRef(0);
  useEffect(() => {
    setDisplayed('');
    i.current = 0;
    const interval = setInterval(() => {
      setDisplayed(t => t + text[i.current]);
      i.current++;
      if (i.current >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
};

export default function LandingPage() {
  const headline = useTypewriter('Build Auth Fast. Ship Securely.');
  return (
    <Background>
      {/* Soft glowing particles */}
      <Particle top="8%" left="10%" size="220px" color="#8B5CF6" />
      <Particle top="60%" left="80%" size="180px" color="#58A6FF" />
      <Particle top="40%" left="50%" size="140px" color="#2DD4BF" />
      <Hero>
        <Headline>
          {headline}
          <Typewriter />
        </Headline>
        <Subheadline>
          The modern authentication starter for developers. <br />
          Secure, beautiful, and ready to scale — just plug in and go.
        </Subheadline>
        <GradientButton href="/register">Get Started</GradientButton>
        <GlassPanel>
          <CodeSnippet>{`// Register a new user
await authApi.register({
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@lovelace.dev',
  password: '********'
});`}</CodeSnippet>
        </GlassPanel>
      </Hero>
      <Footer>
        <FooterLinks>
          <FooterLink href="/login">Login</FooterLink>
          <FooterLink href="/register">Register</FooterLink>
          <FooterLink href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</FooterLink>
        </FooterLinks>
        <SocialIcons>
          <SocialIcon href="https://github.com/" target="_blank" rel="noopener noreferrer">
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.606-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.304-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.649.242 2.872.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </SocialIcon>
        </SocialIcons>
      </Footer>
    </Background>
  );
} 