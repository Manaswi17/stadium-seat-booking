import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import { ReactComponent as StadiumSVG } from '../assets/baseball.svg';  // Import the SVG as a component

function SignUpPage({ onSignUp }) {
  const navigate = useNavigate();

  const handleSignUp = (details) => {
    onSignUp();
    navigate('/booking');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-green-400">
      {/* SVG Section */}
      <div className="hidden md:flex w-full md:w-1/2 justify-center items-center">
        <StadiumSVG className="w-3/4 h-3/4" />
      </div>

      {/* Glassmorphic Sign-Up Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Sign Up</h2>
          <SignUpForm onSubmit={handleSignUp} />
          <p className="mt-4 text-gray-600 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
