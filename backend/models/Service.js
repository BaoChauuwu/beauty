const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, // e.g., 'Trị Mụn Y Khoa', 'Laser & Trẻ Hóa', 'Điều Trị Nám - Tàn Nhang', 'Khám & Soi Da'
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
    },
    price: {
      type: Number,
      required: true, // VNĐ
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    image: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
