import React from 'react';
import { MapPin, Phone, ShieldCheck, Calendar, CheckCircle2 } from 'lucide-react';

export const DoctorHeaderCard = ({ doctor }) => {
  const doctorName = 'BS. Đỗ Nguyễn Quỳnh Ngân';
  const doctorAvatar = '/doctor_ngan.jpg';
  const doctorPhone = '0778726235';

  return (
    <div
      className="doctor-header-grid"
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: '24px',
        border: '1px solid rgba(31, 77, 62, 0.12)',
        boxShadow: 'var(--shadow-soft)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Top Accent Glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1F4D3E, #C5A059, #1F4D3E)' }} />

      {/* Doctor Portrait Frame */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            padding: '3px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1F4D3E, #C5A059)',
            boxShadow: '0 6px 20px rgba(31, 77, 62, 0.2)',
            display: 'inline-block',
          }}
        >
          <img
            src={doctorAvatar}
            alt={doctorName}
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FFFFFF',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Doctor Main Info */}
      <div style={{ minWidth: 0, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px', justifyContent: 'inherit' }}>
          <span className="badge-emerald" style={{ fontSize: '0.78rem' }}>
            <ShieldCheck size={14} /> Bác Sĩ Chuyên Khoa Da Liễu
          </span>
        </div>

        <h1 className="doctor-header-title" style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: '4px 0 8px', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
          {doctorName}
        </h1>

        {/* Doctor Phone */}
        <div style={{ display: 'flex', gap: '16px', margin: '8px 0 14px', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--primary-emerald)', fontWeight: 700, justifyContent: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={15} color="var(--primary-emerald)" />
            <span>Hotline / Zalo Đặt Khám: {doctorPhone}</span>
          </div>
        </div>

        {/* Structured Full-Week Schedule Notice */}
        <div style={{ background: 'rgba(31, 77, 62, 0.04)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(31, 77, 62, 0.12)', textAlign: 'left' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--primary-emerald)" /> BẢNG LỊCH BÁC SĨ MỞ KHÁM CẢ TUẦN (T2 - CN):
          </div>

          <div className="doctor-schedule-grid" style={{ fontSize: '0.8rem' }}>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              ✨ <strong>Làm Da / Spa:</strong> T2 - CN (Sáng 8h30-11h | Chiều/Tối 14h-20h)
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              🩺 <strong>Khám Mới / Soi Da:</strong> T2 - CN (Sáng 9h-11h | Chiều 14h30-18h30)
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              🔄 <strong>Tái Khám Da Liễu:</strong> T2 - CN (Ca sáng/chiều & ca tối muộn đến 20:30)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
