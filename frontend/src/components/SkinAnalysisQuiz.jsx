import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, RefreshCw, Calendar } from 'lucide-react';

export const SkinAnalysisQuiz = ({ onSelectServiceForBooking }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const questions = [
    {
      title: 'Bề mặt làn da của bạn vào buổi trưa thường có biểu hiện gì?',
      options: [
        { label: 'Bóng dầu toàn bộ khuôn mặt, lỗ chân lông to', type: 'oily' },
        { label: 'Bóng dầu vùng chữ T (trán, mũi, cằm), hai bên má khô', type: 'combination' },
        { label: 'Căng rát, khô bong tróc nhẹ hoặc xỉn màu', type: 'dry' },
        { label: 'Dễ ửng đỏ, ngứa mẩn khi đi nắng hoặc đổi mỹ phẩm', type: 'sensitive' },
      ],
    },
    {
      title: 'Tình trạng khuyết điểm trên da bạn lo lắng nhất hiện tại?',
      options: [
        { label: 'Mụn viêm, mụn ẩn, mụn đầu đen tái phát nhiều', type: 'acne' },
        { label: 'Vết nám, tàn nhang, đốm nâu hoặc thâm mụn kéo dài', type: 'pigment' },
        { label: 'Nếp nhăn nông vùng mắt, da chảy xệ mất độ đàn hồi', type: 'aging' },
        { label: 'Da mỏng lộ mao mạch, nhiễm corticoid / rát đỏ', type: 'sensitive' },
      ],
    },
    {
      title: 'Bạn đã từng thực hiện các liệu trình công nghệ cao chưa?',
      options: [
        { label: 'Chưa từng, đây là lần đầu tiên tôi tìm hiểu', type: 'beginner' },
        { label: 'Đã từng lấy nhân mụn / skincare cơ bản tại spa', type: 'basic' },
        { label: 'Đã từng làm Laser, Peel da hoặc Tiêm Meso', type: 'advanced' },
      ],
    },
  ];

  const handleSelectOption = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (ans) => {
    const types = ans.map((a) => a.type);
    if (types.includes('acne') || types.includes('oily')) {
      setResult({
        skinType: 'Da Dầu / Nhiều Mụn Viêm',
        recommendation: 'Liệu Trình Điều Trị Mụn Y Khoa Chuẩn Medical',
        description: 'Phác đồ kết hợp lấy nhân mụn vô trùng, chiếu ánh sáng BBL diệt khuẩn mụn P.acnes và thoa tinh chất phục hồi.',
        servicePrice: 550000,
        doctor: 'TS. BS. Nguyễn Thanh Vân',
      });
    } else if (types.includes('pigment')) {
      setResult({
        skinType: 'Da Sắc Tố (Nám & Tàn Nhang)',
        recommendation: 'Trị Nám - Tàn Nhang Công Nghệ Pico Laser',
        description: 'Tác động bước sóng Pico xung cực ngắn phân tách Melanin chân sâu, làm sáng da không xâm lấn.',
        servicePrice: 1200000,
        doctor: 'ThS. BS. Trần Minh Anh',
      });
    } else if (types.includes('aging') || types.includes('dry')) {
      setResult({
        skinType: 'Da Khô Lão Hóa / Thiếu Độ Ẩm',
        recommendation: 'Cấy Tinh Chất Meso Hydration Trẻ Hóa Da',
        description: 'Cấp ẩm vi điểm Hyaluronic Acid tinh khiết giúp da căng mướt thủy tinh và cải thiện nếp nhăn.',
        servicePrice: 1500000,
        doctor: 'BS. CKI Phạm Mỹ Duyên',
      });
    } else {
      setResult({
        skinType: 'Da Nhạy Cảm / Khám Tổng Quát',
        recommendation: 'Khám & Soi Da Chuẩn Y Khoa 3D',
        description: 'Soi phân tích 8 tầng chỉ số da bằng công nghệ Visia 3D và lập phác đồ chăm sóc cá nhân hóa.',
        servicePrice: 300000,
        doctor: 'BS. CKII Lê Hoàng Nam',
      });
    }
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <section className="container" style={{ padding: '60px 20px 80px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary-dark) 0%, #1c3d31 100%)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          boxShadow: 'var(--shadow-hover)',
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge-gold" style={{ marginBottom: '12px' }}>
            <Sparkles size={14} /> AI SKIN ANALYSIS
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Trắc Nghiệm Phân Tích Da Thông Minh</h2>
          <p style={{ color: '#c7d6cf', fontSize: '0.92rem', marginTop: '6px' }}>
            Trả lời 3 câu hỏi nhanh để nhận ngay gợi ý phác đồ khám da tối ưu từ Bác sĩ Da liễu.
          </p>
        </div>

        {result ? (
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '28px', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(10px)' }}>
            <span className="badge-emerald" style={{ background: 'var(--accent-gold)', color: 'var(--primary-dark)', marginBottom: '12px' }}>
              CHẨN ĐOÁN: {result.skinType}
            </span>

            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: '12px 0 8px' }}>
              Gói Khám Đề Xuất: {result.recommendation}
            </h3>

            <p style={{ color: '#e2eae6', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>
              {result.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '16px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#c7d6cf' }}>Bác sĩ chuyên khoa phụ trách:</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>{result.doctor}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.85rem' }} onClick={restartQuiz}>
                  <RefreshCw size={14} /> Thử Lại
                </button>

                <button
                  className="btn-gold"
                  onClick={() =>
                    onSelectServiceForBooking({
                      name: result.recommendation,
                      price: result.servicePrice,
                      category: result.skinType,
                    })
                  }
                >
                  <Calendar size={16} /> Đặt Lịch Gói Này
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#c7d6cf', marginBottom: '12px' }}>
              <span>Câu hỏi {currentQ + 1} / {questions.length}</span>
              <span>{Math.round(((currentQ + 1) / questions.length) * 100)}% hoàn thành</span>
            </div>

            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', marginBottom: '28px' }}>
              <div style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--accent-gold)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '20px' }}>
              {questions[currentQ].title}
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              {questions[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                >
                  <span>{opt.label}</span>
                  <ArrowRight size={18} color="var(--accent-gold)" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
