import React, { useState, useEffect } from 'react';
import { Star, Award, Calendar, MapPin, Sparkles } from 'lucide-react';

export const DoctorsList = ({ onSelectDoctorForBooking }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="container" style={{ padding: '60px 20px 80px', background: 'rgba(46, 91, 75, 0.03)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="badge-gold" style={{ marginBottom: '12px' }}>
          <Award size={14} /> Chuyên Gia Hàng Đầu
        </span>
        <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)' }}>Đội Ngũ Bác Sĩ Da Liễu Uy Tín</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0' }}>
          100% Bác sĩ có bằng cấp Chuyên Khoa Da Liễu, kinh nghiệm công tác tại các Bệnh viện Da Liễu lớn.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải danh sách bác sĩ...</div>
      ) : (
        <div className="grid-3">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <div className="card-img-wrap" style={{ height: '260px' }}>
                <img src={doctor.avatar} alt={doctor.fullName} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                  <span className="badge-gold">{doctor.experienceYears} Năm Kinh Nghiệm</span>
                </div>
              </div>

              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-emerald)', fontWeight: 700 }}>
                    {doctor.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D4AF37', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Star size={15} fill="#D4AF37" />
                    <span>{doctor.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({doctor.reviewCount})</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '4px' }}>
                  {doctor.fullName}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '12px' }}>
                  Chuyên khoa: {doctor.specialty}
                </p>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5, flex: 1 }}>
                  {doctor.bio}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <MapPin size={15} color="var(--primary-emerald)" />
                  <span>{doctor.hospitalClinic}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phí khám ban đầu</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      {doctor.consultationFee.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <button className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }} onClick={() => onSelectDoctorForBooking(doctor)}>
                    <Calendar size={15} />
                    <span>Chọn Bác Sĩ</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
