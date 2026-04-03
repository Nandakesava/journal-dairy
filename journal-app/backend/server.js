const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ FIX: Correct route paths
const authRoutes = require('./auth');
const entryRoutes = require('./entries');

app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Journal App API is running' });
});

// Root route (important for Render)
app.get('/', (req, res) => {
  res.send('Journal App Backend Running 🚀');
});

// PORT FIX
const PORT = process.env.PORT || 10000;

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch(err => {
    console.error('MongoDB error ❌', err);
  });