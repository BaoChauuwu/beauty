import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ArrowRight, Sparkles, Filter } from 'lucide-react';

export const ServicesGrid = ({ onSelectServiceForBooking }) => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['Tất cả', 'Trị Mụn Y Khoa', 'Laser & Sắc Tố', 'Trẻ Hóa & Phục Hồi', 'Khám & Tư Vấn', 'Điều Trị Sẹo'];

  const filteredServices =
    selectedCategory === 'Tất cả'
      ? services
      : services.filter((s) => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section className="container" style={{ padding: '80px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="badge-emerald" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> Dịch Vụ Da Liễu Cao Cấp
        </span>
        <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)' }}>Danh Mục Liệu Trình Chăm Sóc Da</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0' }}>
          Cam kết ứng dụng dược mỹ phẩm sinh học chuẩn y khoa và hệ thống máy móc nhập khẩu Châu Âu.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '40px',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: selectedCategory === cat ? 'var(--primary-emerald)' : '#FFFFFF',
              color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-main)',
              border: selectedCategory === cat ? '1px solid var(--primary-emerald)' : '1px solid var(--border-light)',
              boxShadow: selectedCategory === cat ? '0 4px 14px rgba(46, 91, 75, 0.25)' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Đang tải danh mục dịch vụ...</div>
      ) : (
        <div className="grid-3">
          {filteredServices.map((service) => (
            <div key={service._id} className="service-card">
              <div className="card-img-wrap">
                <img src={service.image} alt={service.name} />
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge-gold">{service.category}</span>
                </div>
                {service.isPopular && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <span className="badge-emerald" style={{ background: '#FFFFFF' }}>HOT</span>
                  </div>
                )}
              </div>

              <div className="card-body">
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                  {service.name}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', flex: 1 }}>
                  {service.shortDescription}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Clock size={16} color="var(--primary-emerald)" />
                  <span>Thời gian: {service.durationMinutes} phút</span>
                </div>

                {service.benefits && service.benefits.length > 0 && (
                  <div style={{ marginBottom: '20px', borderTop: '1px dashed var(--border-light)', paddingTop: '12px' }}>
                    {service.benefits.map((b, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', marginBottom: '4px' }}>
                        <CheckCircle2 size={14} color="var(--primary-emerald)" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Chi phí niêm yết</span>
                    <span className="price-tag">{service.price.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <button className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }} onClick={() => onSelectServiceForBooking(service)}>
                    <span>Đặt Lịch Gói Này</span>
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
