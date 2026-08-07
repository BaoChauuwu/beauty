import React from 'react';
import { Calendar, Sparkles, Award, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export const HeroSection = ({ onOpenBooking, onNavigate }) => {
  return (
    <section className="hero-section container">
      <div className="hero-grid">
        {/* Left Column Text Content */}
        <div>
          <div className="badge-gold" style={{ marginBottom: '16px' }}>
            <Award size={14} /> Viện Thẩm Mỹ Da Liễu Tiêu Chuẩn Quốc Tế
          </div>

          <h1 className="hero-title">
            Phục Hồi & Nuôi Dưỡng <span>Làn Da Rạng Rỡ</span> Chuẩn Y Khoa
          </h1>

          <p className="hero-desc">
            Đặt lịch khám trực tiếp với đội ngũ Tiến sĩ, Bác sĩ Chuyên khoa Da liễu hàng đầu. Phác đồ điều trị cá nhân hóa giúp dứt điểm mụn, nám và lão hóa da không xâm lấn.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onOpenBooking}>
              <Calendar size={18} />
              <span>Đặt Lịch Khám Ngay</span>
              <ArrowRight size={16} />
            </button>

            <button className="btn-secondary" onClick={() => onNavigate('quiz')}>
              <Sparkles size={18} />
              <span>Trắc Nghiệm Soi Da</span>
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h4>15+</h4>
              <p>Năm Kinh Nghiệm</p>
            </div>
            <div className="stat-item">
              <h4>50.000+</h4>
              <p>Khách Hàng Hài Lòng</p>
            </div>
            <div className="stat-item">
              <h4>100%</h4>
              <p>Bác Sĩ Chuyên Khoa</p>
            </div>
          </div>
        </div>

        {/* Right Column Banner Visual */}
        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800"
            alt="DermaCare Dermatology Clinic"
            className="hero-img"
          />

          {/* Floating Card */}
          <div className="hero-floating-card glass-panel">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-emerald), var(--accent-gold))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D4AF37' }}>
                <Star size={14} fill="#D4AF37" />
                <Star size={14} fill="#D4AF37" />
                <Star size={14} fill="#D4AF37" />
                <Star size={14} fill="#D4AF37" />
                <Star size={14} fill="#D4AF37" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 700, marginLeft: '4px' }}>
                  4.95/5.0
                </span>
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>
                Đạt Chuẩn Y Tế Quốc Tế 2026
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>100% Sát khuẩn dụng cụ tiêu chuẩn bệnh viện</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
