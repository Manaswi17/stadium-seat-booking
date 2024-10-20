import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto">
        <Link to="/" className="text-white text-lg font-bold">Home</Link>
        <Link to="/booking" className="ml-4 text-white text-lg">Book a Seat</Link>
      </div>
    </nav>
  );
}

export default NavBar;
