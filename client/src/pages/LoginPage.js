import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import { ReactComponent as StadiumSVG } from '../assets/basket.svg';
import { useAuth } from './AuthContext'; // Import the Auth context

function LoginPage({ onLogin }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function from context

  const handleLogin = async (details) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: details.email,
        password: details.password,
      });

      if (response.status === 200) {
        onLogin();
        login(details.email); // Save email in context
        navigate('/home');  // Navigate to HomePage after successful login
      } else {
        setError('Invalid login credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-green-400">
      <div className="hidden md:flex w-full md:w-1/2 justify-center items-center">
        <StadiumSVG className="w-3/4 h-3/4" />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Log In</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
