import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EntryPage from './pages/EntryPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider } from './pages/AuthContext';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPAge';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage ';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />  {/* Show splash screen */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" />} />
        {/* <Route path="*" element={<Navigate to="/" />} />  Redirect any invalid route to splash screen */}
        <Route path="/events/:eventId" element={<EventDetailsPage />} /> 
        <Route path="/events/:eventId/seat-selection" element={<SeatSelectionPage />} />
        <Route path="/events/:eventId/booking-confirmation" element={<BookingConfirmationPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage/>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
