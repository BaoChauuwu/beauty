const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id, role, email, name) => {
  return jwt.sign(
    { id, role, email, name },
    process.env.JWT_SECRET || 'dermacare_secret_jwt_key_2026_super_secure_9999',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, skinType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.' });
    }

    if (getDBStatus()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'Email này đã được sử dụng.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone: phone || '',
        skinType: skinType || 'Chưa xác định',
        role: 'patient',
        authType: 'local',
      });

      const token = generateToken(user._id, user.role, user.email, user.name);

      return res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          skinType: user.skinType,
          authType: user.authType,
        },
      });
    } else {
      // In-Memory Fallback mode
      const mockId = 'usr_' + Date.now();
      const token = generateToken(mockId, 'patient', email, name);
      return res.status(201).json({
        token,
        user: {
          _id: mockId,
          name,
          email,
          phone: phone || '',
          role: 'patient',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          skinType: skinType || 'Chưa xác định',
          authType: 'local',
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký: ' + error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền Email và Mật khẩu.' });
    }

    // Default demo accounts check
    if (email === 'admin@dermacare.com' && password === 'admin123') {
      const token = generateToken('admin_001', 'admin', 'admin@dermacare.com', 'Quản trị viên DermaCare');
      return res.json({
        token,
        user: {
          _id: 'admin_001',
          name: 'Quản trị viên DermaCare',
          email: 'admin@dermacare.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
          authType: 'local',
        },
      });
    }

    if (email === 'doctor.van@dermacare.com' && password === 'doctor123') {
      const token = generateToken('doc_001', 'doctor', 'doctor.van@dermacare.com', 'TS. BS. Nguyễn Thanh Vân');
      return res.json({
        token,
        user: {
          _id: 'doc_001',
          name: 'TS. BS. Nguyễn Thanh Vân',
          email: 'doctor.van@dermacare.com',
          role: 'doctor',
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
          authType: 'local',
        },
      });
    }

    if (email === 'benhnhan@gmail.com' && password === 'user123') {
      const token = generateToken('usr_patient_001', 'patient', 'benhnhan@gmail.com', 'Nguyễn Văn Nam');
      return res.json({
        token,
        user: {
          _id: 'usr_patient_001',
          name: 'Nguyễn Văn Nam',
          email: 'benhnhan@gmail.com',
          phone: '0905888999',
          role: 'patient',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          skinType: 'Da hỗn hợp',
          authType: 'local',
        },
      });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email hoặc Mật khẩu không chính xác.' });
      }

      if (user.authType === 'google' && !user.password) {
        return res.status(400).json({ message: 'Tài khoản này được tạo bằng Google. Vui lòng chọn "Đăng nhập bằng Google".' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Email hoặc Mật khẩu không chính xác.' });
      }

      const token = generateToken(user._id, user.role, user.email, user.name);

      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          skinType: user.skinType,
          authType: user.authType,
        },
      });
    } else {
      // In-Memory Fallback login
      const token = generateToken('usr_demo', 'patient', email, 'Bệnh Nhân Demo');
      return res.json({
        token,
        user: {
          _id: 'usr_demo',
          name: 'Bệnh Nhân Demo',
          email,
          phone: '0905123456',
          role: 'patient',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          skinType: 'Da hỗn hợp',
          authType: 'local',
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng nhập: ' + error.message });
  }
};

// @desc    Google Sign-In Authentication
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
  try {
    const { token, credential, profile } = req.body;

    let googleData = {
      email: '',
      name: '',
      picture: '',
      sub: '',
    };

    if (!credential) {
      return res.status(400).json({ message: 'Thiếu Google Credential Token để xác thực.' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ message: 'Google Token không hợp lệ hoặc đã hết hạn: ' + err.message });
    }

    const { email, name, picture, sub } = payload;

    if (getDBStatus()) {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: name || 'Google User',
          email,
          avatar: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          authType: 'google',
          googleId: sub || 'g_' + Date.now(),
          role: 'patient',
        });
      } else if (!user.googleId) {
        user.googleId = sub;
        user.authType = 'google';
        if (picture) user.avatar = picture;
        await user.save();
      }

      const authToken = generateToken(user._id, user.role, user.email, user.name);

      return res.json({
        token: authToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          avatar: user.avatar,
          skinType: user.skinType,
          authType: 'google',
        },
      });
    } else {
      // In-Memory Mode
      const mockId = 'g_usr_' + (sub || Date.now());
      const authToken = generateToken(mockId, 'patient', email, name);
      return res.json({
        token: authToken,
        user: {
          _id: mockId,
          name: name || 'Bệnh nhân (Google)',
          email,
          phone: '0912345678',
          role: 'patient',
          avatar: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          skinType: 'Da dầu',
          authType: 'google',
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xử lý Google Login: ' + error.message });
  }
};

// @desc    Get Current Logged In User Profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    if (getDBStatus() && req.user && req.user._id) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) {
        return res.json(user);
      }
    }
    return res.json({
      _id: req.user.id || 'usr_current',
      name: req.user.name || 'Người dùng DermaCare',
      email: req.user.email,
      role: req.user.role || 'patient',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
