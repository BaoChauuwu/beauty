import React, { useState, useEffect } from 'react';
import { Calendar, Search, Clock, User, CheckCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PatientDashboard = ({ onOpenBooking }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchKey, setSearchKey] = useState(user ? user.phone || user.email || '' : '');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchAppointments = async (params = {}) => {
    setLoading(true);
    try {
      let queryParts = [];
      if (params.email) queryParts.push(`email=${encodeURIComponent(params.email)}`);
      if (params.phone) queryParts.push(`phone=${encodeURIComponent(params.phone)}`);
      if (params.code) queryParts.push(`code=${encodeURIComponent(params.code)}`);
      if (params.key && !params.email && !params.phone) queryParts.push(`phone=${encodeURIComponent(params.key)}`);

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const res = await fetch(`/api/appointments/my-appointments${queryString}`);
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments({ email: user.email, phone: user.phone || '' });
    } else {
      setAppointments([]);
      setSearched(false);
    }
  }, [user]);

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (searchKey) {
      fetchAppointments({ key: searchKey, email: user?.email, phone: searchKey });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge-emerald" style={{ background: '#d1fae5', color: '#065f46' }}>✓ Đã Xác Nhận</span>;
      case 'Completed':
        return <span className="badge-gold">✓ Đã Hoàn Thành Khám</span>;
      case 'Cancelled':
        return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>✕ Đã Hủy</span>;
      default:
        return <span className="badge-emerald">⏳ Chờ Duyệt (Pending)</span>;
    }
  };

  return (
    <section className="container" style={{ padding: '60px 20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge-emerald" style={{ fontSize: '0.78rem' }}>🟢 Đã Tự Động Đồng Bộ Lịch Đặt</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tài khoản: {user.email}</span>
                </div>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>
                  Lịch Hẹn Của Bệnh Nhân {user.name}
                </h2>
              </>
            ) : (
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>Tra Cứu Lịch Hẹn Khám Da Liễu</h2>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Theo dõi tiến độ duyệt ca khám, khung giờ hẹn và ghi chú tư vấn của bác sĩ.
            </p>
          </div>

          <button className="btn-primary" onClick={onOpenBooking}>
            <Calendar size={18} /> Đặt Lịch Mới
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleLookupSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '32px', maxWidth: '540px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập Số điện thoại hoặc Mã đặt lịch (ví dụ: DERMA-88912)..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: '12px 24px' }}>
            <Search size={18} /> Tra Cứu
          </button>
        </form>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tìm kiếm dữ liệu...</div>
        ) : appointments.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {appointments.map((appt) => (
              <div
                key={appt._id}
                style={{
                  background: 'var(--bg-cream)',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                {/* Col 1: Booking Code & Status */}
                <div>
                  <span className="badge-gold" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
                    {appt.bookingCode}
                  </span>
                  <div style={{ marginTop: '8px' }}>{getStatusBadge(appt.status)}</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Ngày tạo: {new Date(appt.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                {/* Col 2: Details */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '4px' }}>
                    Bệnh nhân: {appt.patientName} ({appt.patientPhone})
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--primary-emerald)', fontWeight: 600 }}>
                    Bác sĩ: {appt.doctorId?.fullName || appt.doctorInfo?.fullName || 'Bác sĩ Da Liễu'}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Dịch vụ: {appt.serviceId?.name || appt.serviceInfo?.name || 'Khám Da Liễu'}
                  </p>

                  {appt.skinConditionNotes && (
                    <div style={{ marginTop: '8px', fontSize: '0.82rem', background: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <strong>Ghi chú da:</strong> {appt.skinConditionNotes}
                    </div>
                  )}
                </div>

                {/* Col 3: Time */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    <Clock size={16} color="var(--primary-emerald)" />
                    <span>{appt.timeSlot}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {appt.appointmentDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '44px 20px', background: 'var(--bg-cream)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <FileText size={42} color="var(--primary-emerald)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', fontWeight: 800 }}>
              {searched ? 'Không Tìm Thấy Lịch Hẹn Khớp' : 'Tra Cứu Lịch Hẹn Bệnh Nhân'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px', maxWidth: '480px', margin: '6px auto 0' }}>
              {searched
                ? 'Không tìm thấy ca hẹn nào khớp với từ khóa vừa tìm. Vui lòng kiểm tra lại Số điện thoại hoặc Mã đặt lịch.'
                : '🔒 Vì lý do bảo mật thông tin bệnh nhân, vui lòng Đăng Nhập tài khoản hoặc nhập Số Điện Thoại / Mã Đặt Lịch vào ô tìm kiếm trên để tra cứu.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
