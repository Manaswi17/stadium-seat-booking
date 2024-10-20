const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // You can connect to an external file instead of in-memory

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS seats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seat_number TEXT NOT NULL,
      is_booked BOOLEAN NOT NULL DEFAULT 0
    )
  `);

  // Initialize seats
  for (let i = 1; i <= 100; i++) {
    db.run(`INSERT INTO seats (seat_number, is_booked) VALUES (?, ?)`, [`A${i}`, false]);
  }
});

module.exports = db;
