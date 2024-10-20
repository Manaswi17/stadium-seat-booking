import React from 'react';
import Seat from './Seat';

function SeatGrid({ seats, onBook }) {
  return (
    <div className="grid grid-cols-10 gap-4">
      {seats.map(seat => (
        <Seat key={seat.id} seat={seat} onBook={onBook} />
      ))}
    </div>
  );
}

export default SeatGrid;
