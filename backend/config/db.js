const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dermacare';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[DB] ✅ MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[DB] ⚠️ Không thể kết nối MongoDB (${error.message}).`);
    console.warn(`[DB] ℹ️ Hệ thống sẽ khởi chạy ở chế độ In-Memory / Hybrid fallback để bạn có thể xem & trải nghiệm toàn bộ giao diện!`);
    isConnected = false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
