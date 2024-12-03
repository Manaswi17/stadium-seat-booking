-- Drop existing tables to ensure a clean setup
DROP TABLE IF EXISTS payments, bookings, seats, zones, venues, events, customers CASCADE;

-- Create the customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the venues table
CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL
);

-- Create the events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the zones table
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create the seats table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zones(id),
    seat_number VARCHAR(10) NOT NULL
);

-- Create the bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    cust_id INTEGER NOT NULL REFERENCES customers(id),
    event_id INTEGER NOT NULL REFERENCES events(id),
    seat_id INTEGER NOT NULL REFERENCES seats(id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    status VARCHAR(50) DEFAULT 'booked'
);

-- Create the payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_bookings_customer_event ON bookings (cust_id, event_id);
CREATE INDEX idx_payments_booking ON payments (booking_id);
CREATE INDEX idx_seats_zone ON seats (zone_id);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers to tables
CREATE TRIGGER update_customers_timestamp
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_timestamps();

CREATE TRIGGER update_bookings_timestamp
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_timestamps();

CREATE TRIGGER update_events_timestamp
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_timestamps();

CREATE TRIGGER update_payments_timestamp
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_timestamps();


DO $$
DECLARE
    current_zone CHAR(1);          -- Current zone (A, B, C, ...)
    current_price DECIMAL := 100.00; -- Starting price for Zone A
    zone_ascii INT := ASCII('A');  -- ASCII value of 'A'
    max_ascii INT := ASCII('G');   -- ASCII value of 'G'
    row_number INT;                -- Row number for the seats (1, 2, 3...)
    seat_number INT;               -- Seat number within a row (1 to 5)
BEGIN
    WHILE zone_ascii <= max_ascii LOOP
        -- Convert ASCII value back to character for zone name
        current_zone := CHR(zone_ascii);

        -- Insert the current zone with the price
        INSERT INTO zones (name, price) VALUES (current_zone, current_price);

        -- Insert seats for the current zone
        FOR row_number IN 1..3 LOOP              -- Rows 1, 2, 3
            FOR seat_number IN 1..5 LOOP         -- Seats 1, 2, 3, 4, 5
                INSERT INTO seats (zone_id, seat_number)
                VALUES (
                    (SELECT id FROM zones WHERE name = current_zone),
                    current_zone || row_number || seat_number  -- Generate seat names (e.g., A11, A12)
                );
            END LOOP;
        END LOOP;

        -- Move to the next zone
        zone_ascii := zone_ascii + 1;
        current_price := current_price - 10; -- Decrease the price by 10 for the next zone
    END LOOP;
END $$;