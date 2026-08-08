const express = require('express');
const cors = require('cors');
const { connectDB } = require('../backend/config/db');

const authRoutes = require('../backend/routes/authRoutes');
const doctorRoutes = require('../backend/routes/doctorRoutes');
const serviceRoutes = require('../backend/routes/serviceRoutes');
const appointmentRoutes = require('../backend/routes/appointmentRoutes');

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database (MongoDB Atlas with in-memory fallback)
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// Root route & Health check
app.get('/api', (req, res) => {
  res.json({
    message: '🌿 DermaCare Dermatology Clinic API Service',
    status: 'Running',
    version: '1.0.0',
  });
});

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API Endpoint ${req.originalUrl} không tồn tại.` });
});

module.exports = app;
