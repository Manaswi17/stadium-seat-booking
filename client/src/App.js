import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication state

  // Simulate login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Simulate logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* If not authenticated, redirect to login */}
        <Route
          path="/booking"
          element={
            isAuthenticated ? <BookingPage /> : <Navigate to="/login" />
          }
        />
        
        {/* Login and Sign-Up Pages */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage onSignUp={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
