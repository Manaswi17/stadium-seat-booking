import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EventDetailsPage() {
  const { eventId } = useParams(); // Get event ID from the URL
  const navigate = useNavigate();
  const TOTAL_SEATS = 150; // Hardcoded total seats constant

  const [eventDetails, setEventDetails] = useState(null); // State for event details
  const [availableSeats, setAvailableSeats] = useState(0); // State for available seats
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Fetch event details from API
        const eventResponse = await axios.get(
          `http://localhost:5000/events/${eventId}`
        );
        const event = eventResponse.data;

        // Fetch bookings for this event to calculate available seats
        const bookingsResponse = await axios.get(
          `http://localhost:5000/bookings/${eventId}`
        );
        const bookedSeats = bookingsResponse.data.bookedSeats;

        // Calculate available seats using the hardcoded TOTAL_SEATS
        const available = TOTAL_SEATS - bookedSeats;

        // Update state with event details and available seats
        setEventDetails(event);
        setAvailableSeats(available);
        setLoading(false); // Data fetched, stop loading
      } catch (err) {
        setError('Error fetching event details');
        setLoading(false); // Stop loading on error
      }
    };

    fetchEventDetails(); // Call fetch function when component mounts
  }, [eventId]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-6"
      style={{
        backgroundImage: `url(https://en.reformsports.com/oxegrebi/2023/07/stadium-dimensions.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Event Heading */}
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center shadow-lg p-4 bg-black/50 rounded-lg">
        {eventDetails.name || "Event Details"}
      </h1>

      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-lg">
        {/* Event Image */}
        <div className="mb-6">
          <img
            src={
              eventDetails.imageUrl ||
              'https://images.newscientist.com/wp-content/uploads/2021/12/14103104/PRI_214947217.jpg'
            }
            alt={eventDetails.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        {/* Event Information */}
        <div className="mb-4 text-lg">
          <p>
            <strong>Event Name:</strong> {eventDetails.name}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {new Date(eventDetails.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Total Seats:</strong> {TOTAL_SEATS}
          </p>
          <p>
            <strong>Available Seats:</strong> {availableSeats}
          </p>
        </div>

        {/* Button to Select Seats */}
        <div className="text-center">
          <button
            onClick={() => navigate(`/events/${eventId}/seat-selection`)}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600"
          >
            Select Seat
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;
