import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import axios from 'axios'; // Add this line
import { ReactComponent as StadiumSVG } from '../assets/baseball.svg';  // Import SVG

function SignUpPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const handleSignUp = async (details) => {
    try {
      // Sending sign-up data to Flask API
      const response = await axios.post('http://localhost:5000/signup', details);
      
      if (response.status === 201) {
        // onSignUp();
        navigate('/login');  // Redirect to booking page after successful sign-up
      } else {
        alert('Error during sign-up');
      }
    } catch (error) {
      console.error('Sign-up failed:', error);
      alert('Sign-up failed, please try again');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-green-400">
      <div className="hidden md:flex w-full md:w-1/2 justify-center items-center">
        <StadiumSVG className="w-3/4 h-3/4" />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">Sign Up</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
