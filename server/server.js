const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);
// Middleware
app.use(bodyParser.json());

// Routes
// app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Stadium Ticket Booking API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
