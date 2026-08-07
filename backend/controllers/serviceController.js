const Service = require('../models/Service');
const { getDBStatus } = require('../config/db');

const INITIAL_SERVICES = [
  {
    _id: 'srv_001',
    name: 'Khám & Soi Da Chuẩn Y Khoa 3D',
    category: 'Khám & Tư Vấn',
    shortDescription: 'Soi phân tích 8 chỉ số tổn thương da bằng máy Visia 3D thế hệ mới và tư vấn phác đồ điều trị cá nhân hóa.',
    fullDescription: 'Dịch vụ phân tích sâu cấu trúc da, tầng collagen, sắc tố dưới da và mật độ vi khuẩn P.acnes. Bác sĩ chuyên khoa trực tiếp đọc kết quả và đưa ra phác đồ chăm sóc chuẩn y khoa.',
    price: 300000,
    durationMinutes: 45,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600',
    benefits: ['Phân tích 8 chỉ số da tầng sâu', 'Tư vấn phác đồ bởi bác sĩ CK', 'Tặng bộ quy trình skincare tại nhà'],
    isPopular: true,
  },
  {
    _id: 'srv_002',
    name: 'Liệu Trình Điều Trị Mụn Y Khoa Chuẩn Medical',
    category: 'Trị Mụn Y Khoa',
    shortDescription: 'Lấy nhân mụn chuẩn y khoa, chiếu ánh sáng sinh học BBL / LED diệt khuẩn mụn P.acnes và phục hồi màng bảo vệ.',
    fullDescription: 'Quy trình 12 bước sát khuẩn tuyệt đối, lấy sạch nhân mụn không để lại sẹo thâm, kết hợp chiếu đèn BBL kháng viêm & thoa tinh chất phục hồi da độc quyền.',
    price: 550000,
    durationMinutes: 75,
    image: 'https://images.unsplash.com/photo-1512290900676-26c2a4ed74b8?auto=format&fit=crop&q=80&w=600',
    benefits: ['Không sưng đỏ rát', 'Diệt khuẩn P.acnes đến 95%', 'Sát trùng dụng cụ tiêu chuẩn bệnh viện'],
    isPopular: true,
  },
  {
    _id: 'srv_003',
    name: 'Trị Nám - Tàn Nhang Công Nghệ Pico Laser',
    category: 'Laser & Sắc Tố',
    shortDescription: 'Ứng dụng bước sóng Pico xung cực ngắn phân tách hắc sắc tố Melanin thành các hạt siêu nhỏ tự đào thải.',
    fullDescription: 'Giải pháp dứt điểm các mảng nám chân sâu, tàn nhang, đồi mồi không xâm lấn, không nghỉ dưỡng, mang lại làn da trắng hồng đều màu.',
    price: 1200000,
    durationMinutes: 60,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    benefits: ['Đánh bay nám chân sâu', 'Không gây sẹo hay bỏng rát', 'Bảo hành kết quả điều trị'],
    isPopular: true,
  },
  {
    _id: 'srv_004',
    name: 'Cấy Tinh Chất Meso Hydration Trẻ Hóa Da',
    category: 'Trẻ Hóa & Phục Hồi',
    shortDescription: 'Cấy vi điểm Hyaluronic Acid tinh khiết & Peptide tái tạo tế bào, căng bóng da instant rạng rỡ.',
    fullDescription: 'Cung cấp độ ẩm chuyên sâu gấp 100 lần bôi thoa thông thường, lấp đầy các rãnh nhăn nông, giúp da căng mướt thủy tinh sau 24h.',
    price: 1500000,
    durationMinutes: 60,
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600',
    benefits: ['Căng mướt chuẩn Hàn Quốc', 'Thu nhỏ lỗ chân lông', 'Cải thiện nếp nhăn li ti'],
    isPopular: false,
  },
  {
    _id: 'srv_005',
    name: 'Điều Trị Sẹo Rỗ Bằng Công Nghệ Fractional CO2',
    category: 'Điều Trị Sẹo',
    shortDescription: 'Cắt đáy sẹo rỗ kết hợp Laser Fractional CO2 làm đầy vùng da lồi lõm sẹo mụn lâu năm.',
    fullDescription: 'Tác động sâu vào tầng trung bì bóc tách chân sẹo xơ cứng, kích thích tăng sinh Collagen & Elastin tối đa giúp lấp đầy sẹo rỗ đến 85%.',
    price: 1800000,
    durationMinutes: 90,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    benefits: ['Đầy sẹo rỗ rõ rệt sau 1 liệu trình', 'Tăng sinh collagen tự thân', 'An toàn chuẩn y khoa'],
    isPopular: false,
  },
  {
    _id: 'srv_006',
    name: 'Chemical Peel Tái Tạo Bề Mặt Da Sinh Học',
    category: 'Trẻ Hóa & Phục Hồi',
    shortDescription: 'Thay da sinh học bằng AHA/BHA tinh khiết giúp loại bỏ lớp sừng già cỗi, mờ thâm mụn và sáng da.',
    fullDescription: 'Tẩy tế bào chết chuyên sâu tầng bề mặt, làm thông thoáng lỗ chân lông bị bít tắc, kích thích tế bào da mới mịn màng tươi trẻ xuất hiện.',
    price: 650000,
    durationMinutes: 50,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=600',
    benefits: ['Mờ thâm mụn nhanh chóng', 'Giảm mụn ẩn mụn đầu đen', 'Làn da mịn màng tươi sáng'],
    isPopular: false,
  },
];

// @desc    Get all services
// @route   GET /api/services
exports.getServices = async (req, res) => {
  try {
    if (getDBStatus()) {
      const services = await Service.find({});
      if (services && services.length > 0) {
        return res.json(services);
      }
    }
    return res.json(INITIAL_SERVICES);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      try {
        const service = await Service.findById(id);
        if (service) return res.json(service);
      } catch (err) {}
    }
    const srv = INITIAL_SERVICES.find((s) => s._id === id) || INITIAL_SERVICES[0];
    return res.json(srv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.INITIAL_SERVICES = INITIAL_SERVICES;
