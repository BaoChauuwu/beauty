require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Service = require('./models/Service');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dermacare';
  try {
    console.log('[SEED] Connecting to MongoDB:', uri);
    await mongoose.connect(uri);

    console.log('[SEED] Cleaning existing collections...');
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Service.deleteMany({});

    const salt = await bcrypt.genSalt(10);

    // 1. Admin Account
    const adminPassword = await bcrypt.hash('admin123', salt);
    const adminUser = await User.create({
      name: 'Quản trị viên Hệ thống',
      email: 'admin@dermacare.com',
      password: adminPassword,
      phone: '0905999999',
      role: 'admin',
      authType: 'local',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    });
    console.log('[SEED] ✅ Created Admin account:', adminUser.email);

    // 2. Doctor Account
    const doctorPassword = await bcrypt.hash('doctor123', salt);
    const doctorUser = await User.create({
      name: 'TS. BS. Nguyễn Thanh Vân',
      email: 'doctor.van@dermacare.com',
      password: doctorPassword,
      phone: '0905123456',
      role: 'doctor',
      authType: 'local',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    });
    console.log('[SEED] ✅ Created Doctor account:', doctorUser.email);

    // Create Doctor Profile Linked to User
    await Doctor.create({
      userId: doctorUser._id,
      fullName: 'TS. BS. Nguyễn Thanh Vân',
      title: 'Bác Sĩ Trưởng Khoa Da Liễu',
      specialty: 'Da Liễu Thẩm Mỹ & Trị Mụn Y Khoa',
      bio: 'Hơn 16 năm kinh nghiệm chẩn đoán & điều trị các bệnh lý về da, mụn nặng, nám và phục hồi làn da chuẩn y khoa. Giảng viên Đại Học Y Dược.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=500',
      experienceYears: 16,
      hospitalClinic: 'Phòng Khám Da Liễu Bác Sĩ Vân (DermaCare Clinic)',
      address: '108 Nguyễn Văn Linh, Q. Hải Châu, TP. Đà Nẵng',
      consultationFee: 300000,
      rating: 4.96,
      reviewCount: 420,
      workDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
      availableSlots: [
        '08:00', '08:45', '09:30', '10:15', '11:00',
        '14:00', '14:45', '15:30', '16:15', '17:00', '18:00', '19:00'
      ],
      isFeatured: true,
    });

    // 3. User / Patient Account
    const patientPassword = await bcrypt.hash('user123', salt);
    const patientUser = await User.create({
      name: 'Nguyễn Văn Nam',
      email: 'benhnhan@gmail.com',
      password: patientPassword,
      phone: '0905888999',
      role: 'patient',
      authType: 'local',
      skinType: 'Da hỗn hợp',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    });
    console.log('[SEED] ✅ Created Patient User account:', patientUser.email);

    console.log('[SEED] 🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] ❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedData();
