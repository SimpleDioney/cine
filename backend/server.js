// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/apiRoutes');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    path: req.path
  });
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/api', apiRoutes);
app.use(errorHandler);

// Verify TMDB API key is set
if (!process.env.TMDB_API_KEY) {
  console.error('TMDB_API_KEY is not set in environment variables');
  process.exit(1);
}

const PORT = process.env.PORT || 45232;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Key status:', process.env.TMDB_API_KEY ? 'Set' : 'Not set');
});