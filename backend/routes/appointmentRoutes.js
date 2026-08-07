const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getSlotsByDate,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/slots', getSlotsByDate);
router.post('/', createAppointment);
router.get('/my-appointments', getMyAppointments);
router.get('/', protect, adminOnly, getAppointments);
router.put('/:id/status', protect, adminOnly, updateAppointmentStatus);

module.exports = router;
