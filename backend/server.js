require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// Root route & Health check
app.get('/', (req, res) => {
  res.json({
    message: '🌿 DermaCare Dermatology Clinic API Service',
    status: 'Running',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth',
      doctors: '/api/doctors',
      services: '/api/services',
      appointments: '/api/appointments',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `API Endpoint ${req.originalUrl} không tồn tại.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ message: err.message || 'Lỗi hệ thống máy chủ.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 DermaCare Backend Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`=================================================`);
});
