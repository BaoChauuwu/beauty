import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Check, X, User, Phone, Mail, FileText, ChevronLeft, ChevronRight, ShieldCheck, DollarSign } from 'lucide-react';

export const DoctorCalendarDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAppt, setSelectedAppt] = useState(null);

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('dermacare_token');
      const res = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
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
          prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
        );
        if (selectedAppt && selectedAppt._id === id) {
          setSelectedAppt({ ...selectedAppt, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Filter appointments for the selected date
  const dayAppointments = appointments.filter((a) => a.appointmentDate === selectedDate);
  const pendingTotal = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedTotal = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedTotal = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <section className="container" style={{ padding: '60px 20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-light)' }}>
        {/* Dashboard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge-emerald" style={{ marginBottom: '8px' }}>
              <ShieldCheck size={14} /> DÀNH CHO BÁC SĨ DA LIỄU
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>
              Lịch Làm Việc & Quản Lý Ca Khám
            </h2>
          </div>

          <button className="btn-secondary" onClick={fetchDoctorAppointments}>
            <Clock size={16} /> Làm Mới Lịch
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#fffbe6', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #ffe58f' }}>
            <span style={{ fontSize: '0.8rem', color: '#874d00', fontWeight: 600 }}>Chờ Duyệt (Pending)</span>
            <h3 style={{ fontSize: '1.6rem', color: '#874d00', marginTop: '4px' }}>{pendingTotal}</h3>
          </div>
          <div style={{ background: '#e6f7ff', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #91caff' }}>
            <span style={{ fontSize: '0.8rem', color: '#003eb3', fontWeight: 600 }}>Đã Duyệt (Confirmed)</span>
            <h3 style={{ fontSize: '1.6rem', color: '#003eb3', marginTop: '4px' }}>{confirmedTotal}</h3>
          </div>
          <div style={{ background: '#f6ffed', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #b7eb8f' }}>
            <span style={{ fontSize: '0.8rem', color: '#135200', fontWeight: 600 }}>Đã Khám Xong</span>
            <h3 style={{ fontSize: '1.6rem', color: '#135200', marginTop: '4px' }}>{completedTotal}</h3>
          </div>
        </div>

        {/* Main Grid: Date Selector & Appointments Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Timeline List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)' }}>
                Ca Khám Ngày: <span style={{ color: 'var(--primary-emerald)' }}>{selectedDate}</span>
              </h3>
              <input
                type="date"
                className="form-input"
                style={{ width: '180px', padding: '6px 12px' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải ca khám...</div>
            ) : dayAppointments.length > 0 ? (
              <div style={{ display: 'grid', gap: '14px' }}>
                {dayAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    onClick={() => setSelectedAppt(appt)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: selectedAppt?._id === appt._id ? 'rgba(46, 91, 75, 0.08)' : 'var(--bg-cream)',
                      border: selectedAppt?._id === appt._id ? '2px solid var(--primary-emerald)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary-emerald)', fontSize: '1.1rem' }}>
                          {appt.timeSlot}
                        </span>
                        <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{appt.bookingCode}</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', margin: '4px 0 2px' }}>
                        {appt.patientName}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>SĐT: {appt.patientPhone}</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {appt.status === 'Confirmed' && <span className="badge-emerald">Đã Duyệt</span>}
                      {appt.status === 'Pending' && <span className="badge-gold">Chờ Duyệt</span>}
                      {appt.status === 'Completed' && <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>Khám Xong</span>}
                      {appt.status === 'Cancelled' && <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>Đã Hủy</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-cream)', borderRadius: 'var(--radius-md)' }}>
                Không có lịch khám nào trong ngày {selectedDate}.
              </div>
            )}
          </div>

          {/* Selected Patient Details Panel */}
          {selectedAppt ? (
            <div style={{ background: 'var(--bg-cream)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge-gold">{selectedAppt.bookingCode}</span>
                <span className="badge-emerald">{selectedAppt.status}</span>
              </div>

              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                {selectedAppt.patientName}
              </h3>

              <div style={{ fontSize: '0.88rem', display: 'grid', gap: '8px', color: 'var(--text-main)', marginBottom: '20px' }}>
                <p><strong>Số điện thoại:</strong> {selectedAppt.patientPhone}</p>
                <p><strong>Email:</strong> {selectedAppt.patientEmail}</p>
                <p><strong>Giờ hẹn khám:</strong> {selectedAppt.timeSlot} ngày {selectedAppt.appointmentDate}</p>
                {selectedAppt.skinConditionNotes && (
                  <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <strong>Ghi chú bệnh nhân:</strong> {selectedAppt.skinConditionNotes}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedAppt.status === 'Pending' && (
                  <button
                    className="btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                    onClick={() => handleUpdateStatus(selectedAppt._id, 'Confirmed')}
                  >
                    <Check size={16} /> Duyệt Lịch (Duyệt Khách Này)
                  </button>
                )}

                {selectedAppt.status === 'Confirmed' && (
                  <button
                    className="btn-gold"
                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                    onClick={() => handleUpdateStatus(selectedAppt._id, 'Completed')}
                  >
                    Hoàn Thành Khám
                  </button>
                )}

                {selectedAppt.status !== 'Cancelled' && (
                  <button
                    style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 16px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleUpdateStatus(selectedAppt._id, 'Cancelled')}
                  >
                    <X size={16} /> Từ Chối / Hủy Lịch
                  </button>
                )}
              </div>

              {selectedAppt.status === 'Pending' && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
                  ⚡ Khi duyệt lịch này, các đơn trùng giờ khác (nếu có) sẽ tự động bị Hủy/Reject để đảm bảo công bằng.
                </p>
              )}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-cream)', padding: '40px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
              Nhấp vào một ca khám ở danh sách bên trái để xem chi tiết bệnh nhân & duyệt lịch.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
