const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fullName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Bác sĩ Chuyên khoa Da Liễu',
    },
    specialty: {
      type: String,
      required: true, // Trị mụn y khoa, Laser & Trẻ hóa da, Nám - Tàn nhang, Khám da tổng quát...
    },
    bio: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    hospitalClinic: {
      type: String,
      default: 'Phòng khám Da Liễu DermaCare Premium',
    },
    consultationFee: {
      type: Number,
      default: 300000, // VNĐ
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 120,
    },
    workDays: {
      type: [String],
      default: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
    },
    availableSlots: {
      type: [String],
      default: ['08:30', '09:30', '10:30', '14:00', '15:00', '16:00', '17:30', '19:00'],
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
