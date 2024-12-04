import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

function BookingConfirmationPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { eventId, seatId } = state || {};
  const { userEmail } = useAuth();

  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const eventResponse = await axios.get(
          `http://localhost:5000/events/${eventId}`
        );
        setEventDetails(eventResponse.data);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId]);

  const handleConfirmBooking = async () => {
    try {
      await axios.post(`http://localhost:5000/events/${eventId}/bookings`, {
        eventId,
        seatId,
        email: userEmail,
      });
      alert("Booking confirmed!");
      navigate(`/my-bookings`, {
      });
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-orange-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(https://utsports.com/images/2024/10/21/FB_CheckerNeyland_2024.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Booking Confirmation
        </h2>

        {/* Event Details */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Event Details</h3>
          <p className="text-gray-600">
            <strong>Name:</strong> {eventDetails.name}
          </p>
          <p className="text-gray-600">
            <strong>Date:</strong>{" "}
            {eventDetails.date
              ? new Date(eventDetails.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "TBA"}
          </p>
          <p className="text-gray-600">
            <strong>Venue:</strong> {eventDetails.venue || "Madison Square Garden"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleConfirmBooking}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Confirm Booking
          </button>
          <button
            onClick={() => navigate(`/events/${eventId}/seat-selection`)}
            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmationPage;
