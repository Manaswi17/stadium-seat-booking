import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EntryPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for 3 seconds before navigating to the login page
    const timer = setTimeout(() => {
      navigate('/login'); // Redirect to login page after 3 seconds
    }, 3000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <h1 className="text-5xl font-bold text-white animate-pulse">Welcome to Stadium Ticket Booking</h1>
    </div>
  );
}

export default EntryPage;
