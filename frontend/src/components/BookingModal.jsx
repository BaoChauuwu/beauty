import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ModalSlotSelector = ({ date, serviceType, selectedSlot, onSelectSlot }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    fetch(`/api/appointments/slots?date=${date}&serviceType=${encodeURIComponent(serviceType || '')}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [date, serviceType]);

  if (loading) return <div style={{ padding: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>Đang tải ca rảnh...</div>;

  return (
    <div className="slot-grid" style={{ marginTop: '10px' }}>
      {slots.map((slot) => (
        <button
          key={slot.time}
          type="button"
          disabled={slot.isBooked}
          className={`slot-btn ${selectedSlot === slot.time ? 'selected' : ''}`}
          style={{
            padding: '10px 8px',
            fontSize: '0.82rem',
            opacity: slot.isBooked ? 0.6 : 1,
            cursor: slot.isBooked ? 'not-allowed' : 'pointer',
          }}
          onClick={() => onSelectSlot(slot.time)}
        >
          {slot.displayLabel || slot.time}
        </button>
      ))}
    </div>
  );
};

export const BookingModal = ({ isOpen, onClose, initialService, initialDoctor, onBookingSuccess }) => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Selected Booking State
  const [selectedService, setSelectedService] = useState(initialService || null);
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor || null);
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow as default
  );
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone || '' : '',
    email: user ? user.email : '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setPatientInfo((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (initialService) setSelectedService(initialService);
    if (initialDoctor) setSelectedDoctor(initialDoctor);
  }, [initialService, initialDoctor]);

  useEffect(() => {
    // Fetch options
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        if (!selectedService && data.length > 0) setSelectedService(data[0]);
      });

    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        if (!selectedDoctor && data.length > 0) setSelectedDoctor(data[0]);
      });
  }, []);

  if (!isOpen) return null;

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1 && !selectedService) {
      setErrorMsg('Vui lòng chọn dịch vụ hoặc gói khám.');
      return;
    }
    if (step === 2 && !selectedDoctor) {
      setErrorMsg('Vui lòng chọn bác sĩ khám.');
      return;
    }
    if (step === 3 && (!appointmentDate || !selectedSlot)) {
      setErrorMsg('Vui lòng chọn Ngày khám và Khung giờ rảnh.');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep(step - 1);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientInfo.name || !patientInfo.phone || !patientInfo.email) {
      setErrorMsg('Vui lòng điền đủ Họ tên, Số điện thoại và Email.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        patientName: patientInfo.name,
        patientPhone: patientInfo.phone,
        patientEmail: patientInfo.email,
        doctorId: selectedDoctor._id,
        serviceId: selectedService._id,
        appointmentDate,
        timeSlot: selectedSlot,
        skinConditionNotes: patientInfo.notes,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi đặt lịch khám.');

      setBookingResult(data.appointment);
      if (onBookingSuccess) onBookingSuccess(data.appointment);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setBookingResult(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={resetAndClose}>
          <X size={20} />
        </button>

        {bookingResult ? (
          /* Booking Success Screen */
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(46, 91, 75, 0.1)',
                color: 'var(--primary-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle size={40} />
            </div>

            <span className="badge-gold" style={{ marginBottom: '12px' }}>
              MÃ ĐẶT LỊCH: {bookingResult.bookingCode}
            </span>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: '12px 0 8px' }}>
              Đặt Lịch Khám Da Liễu Thành Công!
            </h2>

            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 24px', fontSize: '0.92rem' }}>
              Cảm ơn <strong>{bookingResult.patientName}</strong>! DermaCare đã tiếp nhận lịch hẹn của bạn. Nhân viên tư vấn sẽ liên hệ xác nhận trong vòng 15 phút.
            </p>

            <div
              style={{
                background: 'var(--bg-cream)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
                marginBottom: '28px',
                fontSize: '0.9rem',
              }}
            >
              <p style={{ marginBottom: '8px' }}>
                <strong>Dịch vụ:</strong> {selectedService?.name}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Bác sĩ khám:</strong> {selectedDoctor?.fullName} ({selectedDoctor?.specialty})
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Thời gian:</strong> {bookingResult.timeSlot} - Ngày {bookingResult.appointmentDate}
              </p>
              <p>
                <strong>Trạng thái:</strong> <span className="badge-emerald">Chờ Xác Nhận (Pending)</span>
              </p>
            </div>

            <button className="btn-primary" onClick={resetAndClose}>
              Hoàn Tất & Đóng
            </button>
          </div>
        ) : (
          /* Step-by-Step Booking Wizard */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="badge-emerald" style={{ marginBottom: '8px' }}>
                <Sparkles size={14} /> Đặt Lịch Khám Online
              </span>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)' }}>Quy Trình Đặt Lịch Khám Da Liễu</h2>
            </div>

            {/* Steps Indicator */}
            <div className="step-indicator">
              <div className={`step-node ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} onClick={() => step > 1 && setStep(1)}>
                <div className="step-number">{step > 1 ? '✓' : '1'}</div>
                <span className="step-label">Dịch Vụ</span>
              </div>

              <div className={`step-node ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} onClick={() => step > 2 && setStep(2)}>
                <div className="step-number">{step > 2 ? '✓' : '2'}</div>
                <span className="step-label">Bác Sĩ</span>
              </div>

              <div className={`step-node ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`} onClick={() => step > 3 && setStep(3)}>
                <div className="step-number">{step > 3 ? '✓' : '3'}</div>
                <span className="step-label">Ngày Giờ</span>
              </div>

              <div className={`step-node ${step === 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <span className="step-label">Thông Tin</span>
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  background: '#fde8e8',
                  color: '#9b1c1c',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '20px',
                  fontSize: '0.88rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* STEP 1: Select Service */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-dark)' }}>
                  Bước 1: Chọn Gói Dịch Vụ / Liệu Trình Khám
                </h3>
                <div style={{ display: 'grid', gap: '12px', maxHeight: '380px', overflowY: 'auto', paddingRight: '6px' }}>
                  {services.map((srv) => (
                    <div
                      key={srv._id}
                      onClick={() => setSelectedService(srv)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedService?._id === srv._id ? '2px solid var(--primary-emerald)' : '1px solid var(--border-light)',
                        background: selectedService?._id === srv._id ? 'rgba(46, 91, 75, 0.05)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{srv.category}</span>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', margin: '4px 0' }}>{srv.name}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{srv.shortDescription}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge-emerald" style={{ fontSize: '0.8rem' }}>
                          Ca {srv.durationMinutes} phút
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Select Doctor */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-dark)' }}>
                  Bước 2: Chọn Bác Sĩ Chuyên Khoa Đảm Nhận
                </h3>
                <div style={{ display: 'grid', gap: '12px', maxHeight: '380px', overflowY: 'auto', paddingRight: '6px' }}>
                  {doctors.map((doc) => (
                    <div
                      key={doc._id}
                      onClick={() => setSelectedDoctor(doc)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedDoctor?._id === doc._id ? '2px solid var(--primary-emerald)' : '1px solid var(--border-light)',
                        background: selectedDoctor?._id === doc._id ? 'rgba(46, 91, 75, 0.05)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <img
                        src={doc.avatar}
                        alt={doc.fullName}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-emerald)', fontWeight: 700 }}>
                          {doc.title}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>{doc.fullName}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Chuyên khoa: {doc.specialty}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37' }}>★ {doc.rating}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.experienceYears} năm KN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Date & Time Slot */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-dark)' }}>
                  Bước 3: Chọn Ngày Khám & Ca Giờ Khám ({selectedService?.name || 'Khám Da'})
                </h3>

                <div className="form-group">
                  <label className="form-label">Chọn Ngày Khám (Thứ 2 - Chủ Nhật)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={appointmentDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setAppointmentDate(e.target.value);
                      setSelectedSlot('');
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label className="form-label">Chọn Ca Giờ Bác Sĩ Rảnh Theo Lịch Chi Tiết</label>
                  <ModalSlotSelector
                    date={appointmentDate}
                    serviceType={selectedService?.name || ''}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Patient Info & Summary */}
            {step === 4 && (
              <form onSubmit={handleConfirmBooking}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-dark)' }}>
                  Bước 4: Nhập Thông Tin Bệnh Nhân
                </h3>

                {/* Summary Card */}
                <div style={{ background: 'var(--bg-cream)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.88rem' }}>
                  <p><strong>Gói khám:</strong> {selectedService?.name} ({selectedService?.price.toLocaleString('vi-VN')} đ)</p>
                  <p><strong>Bác sĩ:</strong> {selectedDoctor?.fullName}</p>
                  <p><strong>Thời gian:</strong> {selectedSlot} ngày {appointmentDate}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Họ và Tên Bệnh Nhân *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nguyễn Văn A"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="0905123456"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Nhận Lịch *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="benhnhan@gmail.com"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô Tả Tình Trạng Da / Ghi Chú Khi Khám</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Ví dụ: Da xuất hiện mụn ẩn hai bên má, nổi mẩn đỏ khi thời tiết thay đổi..."
                    value={patientInfo.notes}
                    onChange={(e) => setPatientInfo({ ...patientInfo, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Đang gửi thông tin...' : 'XÁC NHẬN ĐẶT LỊCH KHÁM'}
                </button>
              </form>
            )}

            {/* Modal Controls Footer */}
            {step < 4 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                {step > 1 ? (
                  <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.88rem' }} onClick={handleBack}>
                    <ArrowLeft size={16} /> Quay Lại
                  </button>
                ) : <div />}

                <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.88rem' }} onClick={handleNext}>
                  Tiếp Theo <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
