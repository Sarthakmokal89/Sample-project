// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

// import routes
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/emails');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => res.send('AwakenU Backend is Running 🚀'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Schedule Cron Jobs
require('./cron/emailJob');

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ AwakenU server running on port ${PORT}`));