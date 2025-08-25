import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext.jsx';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (error) {
      alert('Google login failed: ' + error.message);
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1 className="landing-title">Welcome to MoodBundle</h1>
        <button className="landing-button" onClick={handleLoginClick}>Login</button>
        <button className="landing-button" onClick={handleSignupClick}>Sign Up</button>
        <button className="landing-button google" onClick={handleGoogleLogin}>Continue with Google</button>
      </div>
    </div>
  );
};

export default LandingPage;
