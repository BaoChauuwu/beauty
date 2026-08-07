import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Clock, Calendar, DollarSign, Users, Filter, Sparkles } from 'lucide-react';

export const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAllAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('dermacare_token');
      const res = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching admin appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('dermacare_token');
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculation
  const totalBookings = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const totalRevenue = appointments
    .filter((a) => a.status !== 'Cancelled')
    .reduce((acc, curr) => acc + (curr.serviceId?.price || curr.serviceInfo?.price || 400000), 0);

  const filteredList =
    filterStatus === 'All'
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

  return (
    <section className="container" style={{ padding: '60px 20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-light)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge-emerald" style={{ marginBottom: '8px' }}>
              <ShieldCheck size={14} /> QUẢN TRỊ VIÊN DERMACARE
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>Dashboard Quản Lý Lịch Hẹn Khám</h2>
          </div>

          <button className="btn-secondary" onClick={fetchAllAppointments}>
            <Clock size={16} /> Làm Mới Dữ Liệu
          </button>
        </div>

        {/* Analytics Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div style={{ background: 'var(--bg-cream)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Tổng Đặt Lịch</span>
              <Calendar size={20} color="var(--primary-emerald)" />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginTop: '8px' }}>{totalBookings}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-emerald)' }}>Hôm nay & sắp tới</p>
          </div>

          <div style={{ background: '#fffbe6', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #ffe58f' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#874d00' }}>
              <span>Chờ Duyệt (Pending)</span>
              <Clock size={20} color="#d48806" />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#874d00', marginTop: '8px' }}>{pendingCount}</h3>
            <p style={{ fontSize: '0.8rem', color: '#874d00' }}>Cần xác nhận ngay</p>
          </div>

          <div style={{ background: '#e6f7ff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #91caff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#003eb3' }}>
              <span>Đã Duyệt (Confirmed)</span>
              <Check size={20} color="#1677ff" />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#003eb3', marginTop: '8px' }}>{confirmedCount}</h3>
            <p style={{ fontSize: '0.8rem', color: '#003eb3' }}>Sẵn sàng đón bệnh nhân</p>
          </div>

          <div style={{ background: '#f6ffed', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #b7eb8f' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#135200' }}>
              <span>Doanh Thu Dự Kiến</span>
              <DollarSign size={20} color="#52c41a" />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#135200', marginTop: '8px', fontWeight: 800 }}>
              {totalRevenue.toLocaleString('vi-VN')} đ
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#135200' }}>Tổng từ các ca đặt</p>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: filterStatus === st ? 'var(--primary-emerald)' : 'var(--bg-cream)',
                color: filterStatus === st ? '#FFFFFF' : 'var(--text-main)',
                border: '1px solid var(--border-light)',
              }}
            >
              {st === 'All' ? 'Tất cả' : st}
            </button>
          ))}
        </div>

        {/* Appointments Table / List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải danh sách đặt lịch...</div>
        ) : filteredList.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-cream)', borderBottom: '2px solid var(--border-light)' }}>
                  <th style={{ padding: '14px' }}>Mã & Bệnh Nhân</th>
                  <th style={{ padding: '14px' }}>Bác Sĩ Khám</th>
                  <th style={{ padding: '14px' }}>Dịch Vụ Khám</th>
                  <th style={{ padding: '14px' }}>Ngày & Giờ</th>
                  <th style={{ padding: '14px' }}>Trạng Thái</th>
                  <th style={{ padding: '14px', textAlign: 'right' }}>Thao Tác Duyệt</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((appt) => (
                  <tr key={appt._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px' }}>
                      <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{appt.bookingCode}</span>
                      <div style={{ fontWeight: 700, marginTop: '4px', color: 'var(--primary-dark)' }}>{appt.patientName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{appt.patientPhone}</div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--primary-emerald)' }}>
                        {appt.doctorId?.fullName || appt.doctorInfo?.fullName || 'Bác sĩ Da liễu'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {appt.doctorId?.specialty || appt.doctorInfo?.specialty}
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600 }}>{appt.serviceId?.name || appt.serviceInfo?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary-emerald)', fontWeight: 700 }}>
                        {((appt.serviceId?.price || appt.serviceInfo?.price || 400000)).toLocaleString('vi-VN')} đ
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{appt.timeSlot}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{appt.appointmentDate}</div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      {appt.status === 'Confirmed' && <span className="badge-emerald">Đã Xác Nhận</span>}
                      {appt.status === 'Pending' && <span className="badge-gold">Chờ Duyệt</span>}
                      {appt.status === 'Completed' && <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '999px', fontWeight: 600 }}>Khám Xong</span>}
                      {appt.status === 'Cancelled' && <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '999px', fontWeight: 600 }}>Đã Hủy</span>}
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {appt.status === 'Pending' && (
                          <button
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            onClick={() => handleUpdateStatus(appt._id, 'Confirmed')}
                            disabled={updatingId === appt._id}
                          >
                            <Check size={14} /> Duyệt Lịch
                          </button>
                        )}

                        {appt.status === 'Confirmed' && (
                          <button
                            className="btn-gold"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                            disabled={updatingId === appt._id}
                          >
                            Hoàn Thành
                          </button>
                        )}

                        {appt.status !== 'Cancelled' && (
                          <button
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.78rem',
                              background: '#fee2e2',
                              color: '#991b1b',
                              borderRadius: 'var(--radius-full)',
                              fontWeight: 600,
                            }}
                            onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}
                            disabled={updatingId === appt._id}
                          >
                            <X size={14} /> Hủy Lịch
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>Không có lịch hẹn nào phù hợp bộ lọc.</div>
        )}
      </div>
    </section>
  );
};
