const pool = require('./db');

const createCustomer = async (name, email, password, phone) => {
  const result = await pool.query(
    'INSERT INTO customers (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, password, phone]
  );
  return result.rows[0]; // This should now contain the inserted customer data
};


// Find a customer by email (login)
const findCustomerByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
  return result.rows[0];
};

const getAllEvents = async (searchTerm, page, limit) => {
  try {
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM events
WHERE (name ILIKE $1 
       OR date::text ILIKE $1 
       OR to_char(date, 'HH24:MI') ILIKE $1)
  AND date >= CURRENT_DATE
ORDER BY date ASC
LIMIT $2 OFFSET $3;

    `;

    const result = await pool.query(query, [`%${searchTerm}%`, limit, offset]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get event details by event ID
const getEventDetails = async (eventId) => {
  try {
   
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get booked seats count for a specific event
const getBookedSeats = async (eventId) => {
  try {
    const query = `
      SELECT COUNT(*) AS bookedSeats 
      FROM bookings 
      WHERE event_id = $1 AND status = 'booked'
    `;
    const result = await pool.query(query, [eventId]);
    return parseInt(result.rows[0].bookedseats, 10); // Ensure it's returned as a number
  } catch (error) {
    throw error;
  }
};


const getAllZones = async () => {
  const query = 'SELECT id, name, price FROM zones';

  try {
    // Execute the SQL query and get the rows
    const { rows } = await pool.query(query);
    
    // Return the fetched zones
    return rows;
  } catch (err) {
    console.error('Error fetching zones:', err);
    
    // Rethrow the error for further handling in the calling function
    throw err;
  }
};


const getSeatsByZone = async (zoneId) => {
  const query = 'SELECT id, seat_number FROM seats WHERE zone_id = $1';

  try {
    const { rows } = await pool.query(query, [zoneId]); // zoneId is passed as an integer
    return rows;
  } catch (err) {
    console.error('Error fetching seats:', err);
    throw err;
  }
};



const getAvailableSeatsByZoneAndEvent = async (eventId, zoneId) => {
  const query = `
    SELECT s.id, s.seat_number
    FROM seats s
    LEFT JOIN bookings b ON s.id = b.seat_id AND b.event_id = $1 AND b.status = 'booked'
    WHERE s.zone_id = $2 AND b.seat_id IS NULL;
  `;
  const { rows } = await pool.query(query, [eventId, zoneId]);
  return rows;
};


// Function to retrieve customer ID based on email
const getCustomerIdByEmail = async (email) => {
  const client = await pool.connect();
  try {
    const getCustIdQuery = 'SELECT id FROM customers WHERE email = $1';
    const custIdResult = await client.query(getCustIdQuery, [email]);

    if (custIdResult.rows.length === 0) {
      throw new Error('Customer not found');
    }

    return custIdResult.rows[0].id;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

// Function to create a booking
const createBooking = async (eventId, seatId, email) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cust_id = await getCustomerIdByEmail(email);

    const seatCheckQuery = `
      SELECT COUNT(*) AS count FROM bookings 
      WHERE event_id = $1 AND seat_id = $2 AND status = 'booked'
    `;
    const seatCheckResult = await client.query(seatCheckQuery, [eventId, seatId]);

    if (parseInt(seatCheckResult.rows[0].count, 10) > 0) {
      throw new Error('This seat is already booked for the selected event');
    }

    const insertBookingQuery = `
      INSERT INTO bookings (event_id, seat_id, cust_id, status,created_by)
      VALUES ($1, $2, $3, 'booked',$4)
      RETURNING *
    `;
    const result = await client.query(insertBookingQuery, [eventId, seatId, cust_id,email]);
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Fetch seat details along with the associated zone details
const findSeatById = async (seatId) => {
  try {
    const query = `
      SELECT s.id AS seat_id, s.seat_number, s.zone_id, z.name AS zone_name, z.price AS zone_price
      FROM seats s
      JOIN zones z ON s.zone_id = z.id
      WHERE s.id = $1;
    `;
    
    const result = await pool.query(query, [seatId]);

    if (result.rows.length === 0) {
      return null;  // Return null if no seat found with the given ID
    }

    return result.rows[0];  // Return the seat and zone details
  } catch (error) {
    console.error('Error fetching seat by ID:', error);
    throw error;  // Throw error to be handled in the route/controller
  }
};

// Function to get booking details by booking ID
const getBookingDetailsById = async (bookingId) => {
  const query = `
    SELECT 
      b.id AS booking_id,
      c.name AS customer_name,
      c.email AS customer_email,
      e.name AS event_name,
      e.date AS event_date,
      s.number AS seat_number,
      z.name AS zone_name
    FROM 
      bookings b
    JOIN 
      customers c ON b.cust_id = c.id
    JOIN 
      events e ON b.event_id = e.id
    JOIN 
      seats s ON b.seat_id = s.id
    JOIN 
      zones z ON s.zone_id = z.id
    WHERE 
      b.id = $1
  `;
  
  const result = await db.query(query, [bookingId]);
  return result.rows[0];
};

const getBookingsByCustomerId = async (cust_id) => {
  try {
    const result = await pool.query(
     `SELECT 
  b.*,
  b.id AS booking_id,
  e.name AS event_name,
  s.seat_number,
  z.name AS zone_name,
  z.price AS zone_price, -- Fetch price from zones
  c.name AS customer_name,
  c.email AS customer_email,
  c.phone AS customer_phone,
  b.booking_date,
  b.status
FROM 
  bookings b
JOIN 
  events e ON b.event_id = e.id
JOIN 
  seats s ON b.seat_id = s.id
JOIN 
  zones z ON s.zone_id = z.id
JOIN 
  customers c ON b.cust_id = c.id
WHERE 
  b.cust_id = $1 -- Placeholder for customer ID
  AND b.status = 'booked';
`,
      [cust_id]
    );
    // console.log(result)
    return result.rows;  // Return all bookings associated with the customer
  } catch (error) {
    console.error('Error fetching bookings for customer:', error);
    throw error;
  }
};


// Update booking status to 'unbooked' by booking ID
const cancelBooking = async (bookingId) => {
  try {
    const query = `
      UPDATE bookings 
      SET status = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    
    const result = await pool.query(query, ['unbooked', bookingId]);

    if (result.rows.length === 0) {
      return null; // Return null if no booking is found with the given ID
    }

    return result.rows[0]; // Return the updated booking details
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error; // Throw error to be handled in the route/controller
  }
};

module.exports = {createCustomer,cancelBooking,
  findCustomerByEmail,getAllEvents, getBookingsByCustomerId, getEventDetails,findSeatById,
  getBookedSeats,getAllZones,getSeatsByZone,getAvailableSeatsByZoneAndEvent,createBooking,getCustomerIdByEmail , getBookingDetailsById };
