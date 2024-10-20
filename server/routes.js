const express = require('express');
const { getSeats, bookSeat } = require('./models');
const router = express.Router();

// Get all seats
router.get('/seats', (req, res) => {
  getSeats((err, seats) => {
    if (err) return res.status(500).send(err);
    res.json(seats);
  });
});

// Book a seat
router.post('/book', (req, res) => {
  const { seatId } = req.body;
  bookSeat(seatId, (err, changes) => {
    if (err || changes === 0) return res.status(500).send({ error: 'Failed to book seat' });
    res.status(200).send({ message: 'Seat booked successfully' });
  });
});

module.exports = router;
