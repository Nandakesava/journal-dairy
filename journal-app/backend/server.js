const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ SIMPLE & WORKING CORS
app.use(cors());

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');

app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Journal App API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Journal App Backend Running 🚀');
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch(err => {
    console.error('MongoDB error ❌', err);
  });
