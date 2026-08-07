const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dermacare_secret_jwt_key_2026_super_secure_9999');
      
      // Attempt to load from MongoDB if available
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        req.user = decoded;
      }
      
      if (!req.user) {
        req.user = decoded;
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện chức năng này.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'doctor')) {
    return next();
  }
  return res.status(403).json({ message: 'Quyền truy cập bị từ chối. Dành cho Quản trị viên/Bác sĩ.' });
};

module.exports = { protect, adminOnly };
