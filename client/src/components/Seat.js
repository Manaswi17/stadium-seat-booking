import React from 'react';

function Seat({ seat, onBook }) {
  return (
    <div
      className={`p-4 text-center rounded cursor-pointer ${
        seat.is_booked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
      }`}
      onClick={() => !seat.is_booked && onBook(seat.id)}
    >
      {seat.seat_number}
    </div>
  );
}

export default Seat;
