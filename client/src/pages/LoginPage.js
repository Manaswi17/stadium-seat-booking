import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { ReactComponent as StadiumSVG } from '../assets/basket.svg';  // Import the SVG as a component

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = (details) => {
    onLogin();
    navigate('/booking');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-green-400">
      {/* SVG Section */}
      <div className="hidden md:flex w-full md:w-1/2 justify-center items-center">
        <StadiumSVG className="w-3/4 h-3/4" />
      </div>

      {/* Glassmorphic Login Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Log In</h2>
          <LoginForm onSubmit={handleLogin} />
          <p className="mt-4 text-gray-600 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
