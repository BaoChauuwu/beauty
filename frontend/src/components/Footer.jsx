import React from 'react';
import { Sparkles, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer style={{ background: 'var(--primary-dark)', color: '#FFFFFF', paddingTop: '60px', paddingBottom: '30px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              <div className="logo-icon">
                <Sparkles size={22} />
              </div>
              <span>DermaCare Clinic</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#a3b8af', lineHeight: 1.6, marginBottom: '16px' }}>
              Viện Thẩm Mỹ Da Liễu Cao Cấp tiêu chuẩn y khoa 2026. Chẩn đoán chính xác, phác đồ cá nhân hóa, điều trị dứt điểm mụn, nám & lão hóa.
            </p>
            <span className="badge-gold">Giấy phép y tế: 08892/SYT-GPHĐ</span>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-gold-light)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
              Thông Tin Liên Hệ
            </h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', fontSize: '0.88rem', color: '#d1e0d9' }}>
              <li style={{ display: 'flex', gap: '10px' }}>
                <Phone size={18} color="var(--accent-gold)" />
                <span>Hotline / Zalo: 0778 726 235</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <Clock size={18} color="var(--accent-gold)" />
                <span>Lịch mở khám: 08:00 - 20:30 (T2 - CN)</span>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-gold-light)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
              Liên Kết Nhanh
            </h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '10px', fontSize: '0.88rem', color: '#d1e0d9' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>Trang Chủ</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('services')}>Gói Dịch Vụ Da Liễu</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('doctors')}>Đội Ngũ Bác Sĩ</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('quiz')}>Trắc Nghiệm Phân Tích Da</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('lookup')}>Tra Cứu Lịch Hẹn</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#88a396' }}>
          © 2026 DermaCare Dermatology Clinic System. All rights reserved. Built with React & Node.js + MongoDB.
        </div>
      </div>
    </footer>
  );
};
