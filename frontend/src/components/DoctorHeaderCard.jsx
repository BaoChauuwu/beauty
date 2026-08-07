import React from 'react';
import { MapPin, Phone, ShieldCheck, Calendar, CheckCircle2 } from 'lucide-react';

export const DoctorHeaderCard = ({ doctor }) => {
  const doctorName = 'BS. Đỗ Nguyễn Quỳnh Ngân';
  const doctorAvatar = '/doctor_ngan.jpg';
  const doctorPhone = '0778726235';

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 36px',
        marginBottom: '32px',
        border: '1px solid rgba(31, 77, 62, 0.12)',
        boxShadow: 'var(--shadow-soft)',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '32px',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Top Accent Glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1F4D3E, #C5A059, #1F4D3E)' }} />

      {/* Doctor Portrait Frame */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            padding: '4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1F4D3E, #C5A059)',
            boxShadow: '0 8px 24px rgba(31, 77, 62, 0.2)',
          }}
        >
          <img
            src={doctorAvatar}
            alt={doctorName}
            style={{
              width: '136px',
              height: '136px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FFFFFF',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Doctor Main Info */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span className="badge-emerald">
            <ShieldCheck size={14} /> Bác Sĩ Chuyên Khoa Da Liễu
          </span>
        </div>

        <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', margin: '4px 0 8px', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
          {doctorName}
        </h1>

        {/* Doctor Phone Only - Address Removed */}
        <div style={{ display: 'flex', gap: '24px', margin: '10px 0 16px', flexWrap: 'wrap', fontSize: '0.92rem', color: 'var(--primary-emerald)', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={16} color="var(--primary-emerald)" />
            <span>Hotline / Zalo: {doctorPhone}</span>
          </div>
        </div>

        {/* Structured Schedule Notice */}
        <div style={{ background: 'rgba(31, 77, 62, 0.04)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(31, 77, 62, 0.12)' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--primary-emerald)" /> LỊCH BÁC SĨ NGAN MỞ KHÁM THEO CA GIỜ:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              ✨ <strong>Làm Da (T7, CN):</strong> 8h, 10h30, 14h, 15h30, 17h30, 19h30
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              ✨ <strong>Làm Da (T2 - T6):</strong> 18h
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              🩺 <strong>Khám Mới (T7, CN):</strong> 10h, 15h, 17h
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              🔄 <strong>Tái Khám (T2 - T6):</strong> Sau 19h30 (19:30, 20:00...)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


