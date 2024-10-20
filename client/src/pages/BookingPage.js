import React, { useState, useEffect } from 'react';
import SeatGrid from '../components/SeatGrid';
import BookingForm from '../components/BookingForm'; // Import BookingForm
import NavBar from '../components/NavBar'; // Import NavBar

function BookingPage() {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/seats')
      .then(res => res.json())
      .then(data => {
        setSeats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleBookSeat = (seatId) => {
    fetch('http://localhost:5000/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatId }),
    }).then(() => {
      setSeats(seats.map(seat => (seat.id === seatId ? { ...seat, is_booked: true } : seat)));
    });
  };

  const handleSubmit = (details) => {
    console.log('Booking details:', details);
  };

  if (loading) return <div className="text-center mt-12 text-xl">Loading seats...</div>;
  if (error) return <div className="text-center mt-12 text-xl text-red-500">Error: {error}</div>;

  return (
    <div>
      <NavBar /> {/* Add NavBar here */}
      <div className="p-6">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Book Your Seats</h2>
        </header>
        <SeatGrid seats={seats} onBook={handleBookSeat} />
        <div className="mt-8">
          <BookingForm onSubmit={handleSubmit} /> {/* Add BookingForm here */}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
