import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function SeatSelectionPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [eventName, setEventName] = useState(''); // Store event name
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState('');

  useEffect(() => {
    // Fetch event details by eventId to get the event name
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/events/${eventId}`);
        setEventName(response.data.name); // Set the event name
      } catch (err) {
        console.error('Error fetching event details:', err);
      }
    };

    // Fetch zone details
    const fetchZones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/zones');
        setZones(response.data);
      } catch (err) {
        console.error('Error fetching zones:', err);
      }
    };

    fetchEventDetails();
    fetchZones();
  }, [eventId]);

  const handleZoneChange = async (e) => {
    const zoneId = e.target.value;
    setSelectedZone(zoneId);

    if (zoneId) {
      try {
        const response = await axios.get(`http://localhost:5000/events/${eventId}/seats/${zoneId}`);
        setSeats(response.data);
      } catch (err) {
        console.error('Error fetching seats:', err);
      }
    } else {
      setSeats([]);
    }
  };

  const handleSeatChange = (e) => {
    setSelectedSeat(e.target.value);
  };

  const handleConfirmSelection = () => {
    navigate(`/events/${eventId}/booking-confirmation`, {
      state: { eventId, seatId: selectedSeat }
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-8"
      style={{
        backgroundImage: `url(https://media.istockphoto.com/id/612852170/photo/stadium-grass.jpg?s=612x612&w=0&k=20&c=i89QruQuoCcUCz4Ab1WJ6KVZFp5yG3-3QrWkp83DQlg=)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Seat Selection Card */}
      <div className="max-w-lg bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Seat Selection <p>{eventName}</p>
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Zone</label>
          <select
            value={selectedZone}
            onChange={handleZoneChange}
            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none"
          >
            <option value="">Select a Zone</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} - ${zone.price}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Seat No.</label>
          <select
            value={selectedSeat}
            onChange={handleSeatChange}
            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none"
            disabled={!selectedZone}
          >
            <option value="">Select a Seat No.</option>
            {seats.map((seat) => (
              <option key={seat.id} value={seat.id}>
                {seat.seat_number}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirmSelection}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600"
            disabled={!selectedSeat}
          >
            Confirm Selection
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="max-w-lg">
        <img
          src="/Stadium.png" // Use your image from the public folder
          alt="Stadium"
          className="rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}

export default SeatSelectionPage;
