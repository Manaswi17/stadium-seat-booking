const express = require('express');
const { getSeats, bookSeat,createCustomer, getEventDetails,cancelBooking, getCustomerIdByEmail,getBookedSeats ,createBooking,findSeatById,getBookingsByCustomerId, findCustomerByEmail,getAllEvents,getAllZones,getBookingDetailsById,getSeatsByZone ,getAvailableSeatsByZoneAndEvent } = require('./models');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const router = express.Router();

// const JWT_SECRET = 'your_jwt_secret_key';

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if customer already exists
  const existingCustomer = await findCustomerByEmail(email);
  if (existingCustomer) {
    return res.status(400).json({ message: 'Customer already exists' });
  }

  // Create a new customer
  const newCustomer = await createCustomer(name, email, password, phone);

  res.status(201).json({ 
    customer: {  
      name: newCustomer.name, 
      email: newCustomer.email, 
      phone: newCustomer.phone 
    } 
  });
});




// const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find customer by email
  const customer = await findCustomerByEmail(email);
  if (!customer) {
    return res.status(400).json({ message: 'Invalid username' });
  }

 // Directly compare the input password with the stored password
 if (password !== customer.password) {
  return res.status(400).json({ message: 'Invalid credentials' });
}

  // If credentials are valid, return customer data with status 200
  res.status(200).json({ 
    customer: { 
      id: customer.id, 
      name: customer.name, 
      email: customer.email, 
      phone: customer.phone 
    } 
  });
});


router.get('/events', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const events = await getAllEvents(search, parseInt(page), parseInt(limit));
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to get event details
router.get('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await getEventDetails(eventId); // Call model function
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event details' });
  }
});

// Route to get booked seats count
router.get('/bookings/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const bookedSeats = await getBookedSeats(eventId); // Call model function
    res.json({ bookedSeats });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching booking data' });
  }
});

// Route to get all zones
router.get('/zones', async (req, res) => {
  try {
    const zones = await getAllZones();
    res.json(zones);
    // console.log(zones)
  } catch (err) {
    console.error('Error fetching zones:', err);
    res.status(500).json({ error: 'Error fetching zones' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await findCustomerByEmail(email);
    res.json(user);
  } catch (err) {
    console.error('Error fetching customer by email:', err);
    res.status(500).json({ error: 'Error fetching customer' });
  }
});


// Route to get available seats by event and zone
router.get('/events/:eventId/seats/:zoneId', async (req, res) => {
  const { eventId, zoneId } = req.params;

  if (isNaN(eventId) || isNaN(zoneId)) {
    return res.status(400).json({ error: 'Invalid event or zone ID' });
  }

  try {
    const seats = await getAvailableSeatsByZoneAndEvent(parseInt(eventId, 10), parseInt(zoneId, 10));
    res.json(seats);
  } catch (err) {
    console.error('Error fetching available seats:', err);
    res.status(500).json({ error: 'Error fetching available seats' });
  }
});


/// Route to create a booking for a specific event
router.post('/events/:eventId/bookings', async (req, res) => {
  const { eventId } = req.params;
  const { seatId, email } = req.body;

  try {
    if (!eventId || !seatId || !email) {
      return res.status(400).json({ error: 'Missing required booking details' });
    }

    const booking = await createBooking(eventId, seatId, email);
    
    // Send a single response
    return res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    console.error('Error creating booking:', err);
    return res.status(500).json({ error: 'Error confirming booking' });
  }
});



// Endpoint to get booking details by booking ID
router.get('/bookings/:bookingId', async (req, res) => {
  const { bookingId } = req.params;

  try {
    const bookingDetails = await getBookingDetailsById(bookingId);

    if (!bookingDetails) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(bookingDetails);
  } catch (err) {
    console.error('Error fetching booking details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const { id } = req.query;
    // console.log(id)
    if (!id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }
    const event = await getEventDetails(id);
    res.json(event);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    res.status(500).json({ error: 'Error fetching event' });
  }
});

router.get('/seats', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Seat ID is required' });
    }
    const seat = await findSeatById(id);
    res.json(seat);
  } catch (err) {
    console.error('Error fetching seat by ID:', err);
    res.status(500).json({ error: 'Error fetching seat' });
  }
});

// Route to get bookings for a specific user by email (fetching cust_id first)
router.get('/bookings/user/:email', async (req, res) => {
  const { email } = req.params;
// console.log(email)
  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required to fetch bookings' });
    }

    // Retrieve customer ID by email
    const cust_id = await getCustomerIdByEmail(email);
    if (!cust_id) {
      return res.status(404).json({ error: 'No user found with this email' });
    }
    // console.log(first)
// console.log(cust_id)
    // Fetch bookings using cust_id
    const userBookings = await getBookingsByCustomerId(cust_id);
    if (userBookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
    // console.log(userBookings)

    res.status(200).json({ bookings: userBookings });
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Error fetching bookings for the user' });
  }
});



// Route: Cancel a booking
router.put('/bookings/cancel/:booking_id', async (req, res) => {
  const { booking_id } = req.params;
  console.log(booking_id)

  try {
    const canceledBooking = await cancelBooking(booking_id);
    if (!canceledBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking canceled successfully', booking: canceledBooking });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
