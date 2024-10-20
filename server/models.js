const db = require('./db');

// Get all seats
function getSeats(callback) {
  db.all('SELECT * FROM seats', (err, rows) => {
    callback(err, rows);
  });
}

// Book a seat
function bookSeat(seatId, callback) {
  db.run('UPDATE seats SET is_booked = 1 WHERE id = ?', [seatId], function (err) {
    callback(err, this.changes);
  });
}

module.exports = { getSeats, bookSeat };
