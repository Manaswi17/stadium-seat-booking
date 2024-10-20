import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-green-400">
      <h1 className="text-5xl font-bold text-white mb-6">Stadium Ticket Booking</h1>
      <p className="text-lg text-gray-100 mb-8 text-center max-w-lg">
        Book your seats for the upcoming match! Secure your spot before it's gone. 
      </p>
      <Link to="/booking" className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-200">
        Book Now
      </Link>
    </div>
  );
}

export default HomePage;
