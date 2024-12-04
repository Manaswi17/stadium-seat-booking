import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function Mybookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userEmail } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/bookings/user/${userEmail}`
      );
      setBookings(response.data.bookings);
    } catch (err) {
      setError("Error fetching bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (booking_id) => {
    try {
      await axios.put(`http://localhost:5000/bookings/cancel/${booking_id}`);
      alert("Booking canceled successfully");
      fetchBookings();
    } catch (err) {
      alert("Error canceling booking. Please try again.");
      console.error(err);
    }
  };

  const downloadTicket = (booking) => {
    const doc = new jsPDF();

    // Title Section
    doc.setFontSize(22);
    doc.setTextColor(40, 116, 240); // Blue color
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Arena Vibes - Stadium Seat Booking", 105, 30, { align: "center" });

    // Add a divider line
    doc.setDrawColor(50, 50, 50); // Grey line color
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);

    // Event Details Section
    doc.setFontSize(14);
    doc.text("Event Details:", 10, 50);
    doc.setFontSize(12);
    doc.text(`Event Name: ${booking.event_name}`, 10, 60);
    doc.text(
      `Event Date: ${new Date(booking.booking_date).toLocaleDateString()}`,
      10,
      70
    );
    doc.text(`Zone: ${booking.zone_name}`, 10, 80);
    doc.text(`Price per Ticket: $${booking.zone_price}`, 10, 90);

    // Booking Details Section
    doc.setFontSize(14);
    doc.text("Booking Details:", 10, 110);
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${booking.booking_id}`, 10, 120);
    doc.text(
      `Booking Date: ${new Date(booking.booking_date).toLocaleDateString()} ${
        booking.booking_date
          ? new Date(booking.booking_date).toLocaleTimeString()
          : ""
      }`,
      10,
      130
    );
    doc.text(`Status: ${booking.status}`, 10, 140);

    // User Details Section
    doc.setFontSize(14);
    doc.text("User Details:", 10, 160);
    doc.setFontSize(12);
    doc.text(`Name: ${booking.customer_name || "N/A"}`, 10, 170);
    doc.text(`Email: ${booking.customer_email || "N/A"}`, 10, 180);
    doc.text(`Phone: ${booking.customer_phone || "N/A"}`, 10, 190);

    // Footer Section
    doc.setFontSize(10);
    doc.setTextColor(100); // Grey color
    doc.text(
      "Thank you for booking with Arena Vibes! We hope you enjoy the event.",
      105,
      280,
      { align: "center" }
    );

    // Save the PDF with a unique filename
    doc.save(`Ticket_${booking.event_name}_${booking.booking_id}.pdf`);
  };

  useEffect(() => {
    fetchBookings();
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6 relative">
        {/* Home Button */}
        <button
          onClick={() => navigate("/home")}
          className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          My Bookings
        </h1>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
            <span className="ml-4 text-gray-700 text-lg">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-gray-600 font-semibold border border-gray-200">
                    Event Name
                  </th>
                  <th className="px-4 py-3 text-gray-600 font-semibold border border-gray-200">
                    Seat Number
                  </th>
                  <th className="px-4 py-3 text-gray-600 font-semibold border border-gray-200">
                    Zone
                  </th>
                  <th className="px-4 py-3 text-gray-600 font-semibold border border-gray-200">
                    Booking Status
                  </th>
                  <th className="px-4 py-3 text-gray-600 font-semibold border border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
  {bookings.map((booking) => {
    const isPastBooking =
      new Date(booking.booking_date).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0); // Past bookings logic

    return (
      <tr
        key={booking.id}
        className="hover:bg-gray-50 transition duration-200"
      >
        <td className="px-4 py-3 border border-gray-200">
          {booking.event_name}
        </td>
        <td className="px-4 py-3 border border-gray-200">
          {booking.seat_number}
        </td>
        <td className="px-4 py-3 border border-gray-200">
          {booking.zone_name}
        </td>
        <td className="px-4 py-3 border border-gray-200">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === "booked"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {booking.status}
          </span>
        </td>
        <td className="px-4 py-3 border border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => downloadTicket(booking)}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
            >
              Download Ticket
            </button>
            <button
              onClick={() => cancelBooking(booking.booking_id)}
              className={`px-4 py-2 text-white text-sm font-medium rounded-md transition duration-200 ${
                isPastBooking
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              }`}
              disabled={isPastBooking} // Disable only for past bookings
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>

            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500">No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mybookings;
