const Doctor = require('../models/Doctor');
const { getDBStatus } = require('../config/db');

// Main Single Doctor profile for the clinic
const MAIN_DOCTOR = {
  _id: 'doc_main_001',
  fullName: 'BS. Đỗ Nguyễn Quỳnh Ngân',
  title: 'Bác Sĩ Da Liễu',
  specialty: 'Da Liễu Thẩm Mỹ',
  bio: '',
  avatar: '/doctor_ngan.jpg',
  phone: '0778726235',
  address: '',
  rating: 5.0,
  reviewCount: 150,
  workDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
  availableSlots: [
    '08:00', '10:30', '14:00', '15:30', '17:30', '18:00', '19:30'
  ],
};

// @desc    Get main doctor details
// @route   GET /api/doctors
exports.getDoctors = async (req, res) => {
  try {
    if (getDBStatus()) {
      await Doctor.updateMany({}, {
        $set: {
          fullName: 'BS. Đỗ Nguyễn Quỳnh Ngân',
          avatar: '/doctor_ngan.jpg',
          phone: '0778726235',
          address: '',
          title: 'Bác Sĩ Da Liễu',
        }
      });
    }
    return res.json([MAIN_DOCTOR]);
  } catch (error) {
    return res.json([MAIN_DOCTOR]);
  }
};

// @desc    Get main doctor by ID
// @route   GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  return res.json(MAIN_DOCTOR);
};

module.exports.MAIN_DOCTOR = MAIN_DOCTOR;
