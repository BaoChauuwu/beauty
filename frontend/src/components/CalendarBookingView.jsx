import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle, Sparkles, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CalendarBookingView = ({ doctor, onBookingSuccess, onOpenAuth }) => {
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [serviceType, setServiceType] = useState('Làm da'); // 'Làm da' | 'Khám mới' | 'Tái khám'
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slots, setSlots] = useState([]);
  const [dayOfWeekName, setDayOfWeekName] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Patient Info
  const [patientInfo, setPatientInfo] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone || '' : '',
    email: user ? user.email : '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
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

  // Fetch slots whenever selectedDateStr or serviceType changes
  const fetchSlots = () => {
    setLoadingSlots(true);
    fetch(`/api/appointments/slots?date=${selectedDateStr}&serviceType=${encodeURIComponent(serviceType)}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        if (data.dayOfWeekName) setDayOfWeekName(data.dayOfWeekName);
        setLoadingSlots(false);
      })
      .catch((err) => {
        console.error('Error fetching slots:', err);
        setLoadingSlots(false);
      });
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDateStr, serviceType]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (dayNum) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    setSelectedDateStr(dateStr);
    setSelectedSlot('');
    setErrorMsg('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');



    if (!selectedSlot) {
      setErrorMsg('Vui lòng chọn 1 khung giờ khám còn trống trong danh sách.');
      return;
    }

    if (!patientInfo.name || !patientInfo.phone || !patientInfo.email) {
      setErrorMsg('Vui lòng điền đủ Họ tên, Số điện thoại và Email.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        patientName: patientInfo.name,
        patientPhone: patientInfo.phone,
        patientEmail: patientInfo.email,
        appointmentDate: selectedDateStr,
        timeSlot: selectedSlot,
        serviceType: serviceType,
        skinConditionNotes: patientInfo.notes,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 || data.conflict) {
          fetchSlots();
          throw new Error(data.message || 'Khung giờ này vừa được người khác đặt trước. Hệ thống đã tự động từ chối yêu cầu của bạn, vui lòng chọn khung giờ khác!');
        }
        throw new Error(data.message || 'Đặt lịch thất bại.');
      }

      setBookingResult(data.appointment);
      if (onBookingSuccess) onBookingSuccess(data.appointment);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '36px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-light)' }}>
      {bookingResult ? (
        /* Booking Confirmation Screen */
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(46, 91, 75, 0.1)',
              color: 'var(--primary-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle2 size={48} />
          </div>

          <span className="badge-gold" style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
            MÃ TRA CỨU KHÁM: {bookingResult.bookingCode}
          </span>

          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', margin: '12px 0 8px', fontFamily: 'var(--font-serif)' }}>
            Đã Tiếp Nhận Đặt Lịch Khám!
          </h2>

          <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 28px', fontSize: '0.95rem' }}>
            Cảm ơn bệnh nhân <strong>{bookingResult.patientName}</strong>! Lịch khám với{' '}
            <strong>{doctor?.fullName || 'BS. Đỗ Nguyễn Quỳnh Ngân'}</strong> đã được lưu ở trạng thái <strong>Chờ Duyệt (Pending Validate)</strong>.
          </p>

          <div
            style={{
              background: 'var(--bg-cream)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              marginBottom: '32px',
              maxWidth: '580px',
              margin: '0 auto 32px',
              border: '1.5px solid var(--border-light)',
            }}
          >
            <p style={{ marginBottom: '10px', fontSize: '0.95rem' }}>
              <strong>Dịch vụ:</strong> {serviceType}
            </p>
            <p style={{ marginBottom: '10px', fontSize: '0.95rem' }}>
              <strong>Ngày khám:</strong> {bookingResult.appointmentDate} ({dayOfWeekName})
            </p>
            <p style={{ marginBottom: '10px', fontSize: '0.95rem' }}>
              <strong>Khung giờ hẹn:</strong> <span style={{ color: 'var(--primary-emerald)', fontWeight: 800 }}>{bookingResult.timeSlot}</span>
            </p>
            <p style={{ marginBottom: '10px', fontSize: '0.95rem' }}>
              <strong>Hotline / Zalo:</strong> 0778726235
            </p>
            <div style={{ marginTop: '14px', padding: '12px 14px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 'var(--radius-sm)', color: '#874d00', fontSize: '0.86rem' }}>
              ℹ️ <strong>Quy trình xử lý:</strong> Lịch của bạn được ưu tiên giữ slot. Nếu có bệnh nhân khác gửi trùng khung giờ này sau bạn, hệ thống sẽ tự động reject họ. Phòng khám sẽ gọi điện xác nhận trong 15 phút!
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              setBookingResult(null);
              setSelectedSlot('');
              fetchSlots();
            }}
          >
            Đặt Lịch Ca Khác
          </button>
        </div>
      ) : (
        /* Main Interactive Schedule View */
        <div>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="badge-emerald" style={{ marginBottom: '8px' }}>
              <Sparkles size={14} /> BẢNG LỊCH ĐẶT KHÁM THEO GIỜ CHUYÊN KHOA
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)' }}>
              Lịch Làm Việc Chi Tiết BS. Đỗ Nguyễn Quỳnh Ngân
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
              Hệ thống quản lý khung giờ thông minh: tự động phân bổ ca rảnh & xử lý duyệt lịch công bằng.
            </p>
          </div>

          {/* Service Category Selection Tabs */}
          <div style={{ background: 'var(--bg-cream)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '28px', border: '1.5px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={18} color="var(--primary-emerald)" /> 1. Chọn Nhu Cầu / Loại Dịch Vụ Khám:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => { setServiceType('Làm da'); setSelectedSlot(''); setErrorMsg(''); }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: serviceType === 'Làm da' ? '2px solid var(--primary-emerald)' : '1px solid var(--border-light)',
                  background: serviceType === 'Làm da' ? 'var(--primary-emerald)' : '#FFFFFF',
                  color: serviceType === 'Làm da' ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: serviceType === 'Làm da' ? '0 4px 12px rgba(46, 91, 75, 0.25)' : 'none',
                }}
              >
                <div>✨ Lịch Làm Da / Spa</div>
                <div style={{ fontSize: '0.74rem', opacity: 0.9, marginTop: '2px', fontWeight: 400 }}>
                  T7, CN: 8h, 10h30, 14h, 15h30, 17h30, 19h30 | T2-T6: 18h
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setServiceType('Khám mới'); setSelectedSlot(''); setErrorMsg(''); }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: serviceType === 'Khám mới' ? '2px solid var(--primary-emerald)' : '1px solid var(--border-light)',
                  background: serviceType === 'Khám mới' ? 'var(--primary-emerald)' : '#FFFFFF',
                  color: serviceType === 'Khám mới' ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: serviceType === 'Khám mới' ? '0 4px 12px rgba(46, 91, 75, 0.25)' : 'none',
                }}
              >
                <div>🩺 Lịch Khám Mới / Soi Da</div>
                <div style={{ fontSize: '0.74rem', opacity: 0.9, marginTop: '2px', fontWeight: 400 }}>
                  T7, CN: 10h, 15h, 17h | T2-T6: 17h30, 18h30
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setServiceType('Tái khám'); setSelectedSlot(''); setErrorMsg(''); }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: serviceType === 'Tái khám' ? '2px solid var(--primary-emerald)' : '1px solid var(--border-light)',
                  background: serviceType === 'Tái khám' ? 'var(--primary-emerald)' : '#FFFFFF',
                  color: serviceType === 'Tái khám' ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: serviceType === 'Tái khám' ? '0 4px 12px rgba(46, 91, 75, 0.25)' : 'none',
                }}
              >
                <div>🔄 Lịch Tái Khám</div>
                <div style={{ fontSize: '0.74rem', opacity: 0.9, marginTop: '2px', fontWeight: 400 }}>
                  T2-T6: Sau 19h30 (19:30, 20:00, 20:30) | T7, CN: 9h30, 11h30, 16h30
                </div>
              </button>
            </div>

            {/* Clear Rule Explanation Banner */}
            <div style={{ padding: '10px 14px', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              📌 <strong>Quy định khung giờ chuẩn dịch vụ [{serviceType}]:</strong>{' '}
              {serviceType === 'Làm da' && 'Thứ 7 & Chủ Nhật có nhiều ca rảnh trong ngày (08:00 - 19:30). Từ Thứ 2 đến Thứ 6 bác sĩ ưu tiên nhận ca tối sau giờ làm (18:00).'}
              {serviceType === 'Khám mới' && 'Thứ 7 & Chủ Nhật nhận ca sáng/chiều (10:00, 15:00, 17:00). Từ Thứ 2 đến Thứ 6 nhận ca 17:30 và 18:30.'}
              {serviceType === 'Tái khám' && 'Từ Thứ 2 đến Thứ 6 nhận các ca tối muộn sau 19h30. Thứ 7 & Chủ Nhật nhận ca 09:30, 11:30, 16:30.'}
            </div>
          </div>

          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                color: '#991b1b',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                border: '1px solid #fecaca',
              }}
            >
              <ShieldAlert size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Thông Báo Tự Động Rejected / Trùng Giờ:</strong>
                <p style={{ marginTop: '4px' }}>{errorMsg}</p>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', alignItems: 'start' }}>
            {/* Left Column: Interactive Month Calendar */}
            <div style={{ background: 'var(--bg-cream)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '8px 12px' }}
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft size={18} />
                </button>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', fontWeight: 700 }}>
                  {monthNames[month]} - {year}
                </h3>

                <button
                  className="btn-secondary"
                  style={{ padding: '8px 12px' }}
                  onClick={handleNextMonth}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day Name Header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <div>T2</div>
                <div>T3</div>
                <div>T4</div>
                <div>T5</div>
                <div>T6</div>
                <div>T7</div>
                <div>CN</div>
              </div>

              {/* Calendar Days Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {Array.from({ length: startingDayOffset }).map((_, idx) => (
                  <div key={`empty-${idx}`} style={{ height: '44px' }} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const formattedMonth = String(month + 1).padStart(2, '0');
                  const formattedDay = String(dayNum).padStart(2, '0');
                  const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

                  const isSelected = dateStr === selectedDateStr;
                  const isToday = dateStr === todayStr;
                  const isPast = new Date(dateStr) < new Date(todayStr);

                  return (
                    <button
                      key={dayNum}
                      disabled={isPast}
                      onClick={() => handleSelectDate(dayNum)}
                      style={{
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        background: isSelected
                          ? 'var(--primary-emerald)'
                          : isToday
                          ? 'rgba(46, 91, 75, 0.15)'
                          : isPast
                          ? '#F0F0F0'
                          : '#FFFFFF',
                        color: isSelected
                          ? '#FFFFFF'
                          : isPast
                          ? '#AAAAAA'
                          : isToday
                          ? 'var(--primary-emerald)'
                          : 'var(--text-main)',
                        border: isSelected
                          ? '2px solid var(--primary-emerald)'
                          : isToday
                          ? '2px solid var(--primary-emerald)'
                          : '1px solid var(--border-light)',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        boxShadow: isSelected ? '0 4px 12px rgba(46, 91, 75, 0.3)' : 'none',
                      }}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Time Slots & Booking Form */}
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)' }}>
                    2. Chọn Ca Khám Ngày: <span style={{ color: 'var(--primary-emerald)' }}>{selectedDateStr}</span> ({dayOfWeekName})
                  </h3>
                  <button
                    type="button"
                    onClick={fetchSlots}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-emerald)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    <RefreshCw size={14} /> Tải lại slot
                  </button>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Lịch cho <strong>{serviceType}</strong> vào <strong>{dayOfWeekName}</strong>:
                </p>

                {loadingSlots ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang cập nhật ca rảnh...</div>
                ) : (
                  <div style={{ marginTop: '14px' }}>
                    <div className="slot-grid">
                      {slots.map((slot) => {
                        const isPending = slot.status === 'Pending';

                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={slot.isBooked}
                            className={`slot-btn ${selectedSlot === slot.time ? 'selected' : ''}`}
                            style={{
                              padding: '12px 10px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '100%',
                              minHeight: '78px',
                              background: slot.isBooked
                                ? isPending
                                  ? '#fffbe6'
                                  : '#fee2e2'
                                : selectedSlot === slot.time
                                ? 'var(--primary-emerald)'
                                : '#ffffff',
                              borderColor: slot.isBooked
                                ? isPending
                                  ? '#ffe58f'
                                  : '#fca5a5'
                                : selectedSlot === slot.time
                                ? 'var(--primary-emerald)'
                                : 'var(--border-light)',
                              color: slot.isBooked
                                ? isPending
                                  ? '#874d00'
                                  : '#991b1b'
                                : selectedSlot === slot.time
                                ? '#ffffff'
                                : 'var(--text-main)',
                              cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                              opacity: slot.isBooked ? 0.85 : 1,
                            }}
                            onClick={() => setSelectedSlot(slot.time)}
                          >
                            <span style={{ fontSize: '0.96rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                              {slot.displayLabel || slot.time}
                            </span>
                            <span style={{ fontSize: '0.72rem', opacity: 0.95, fontWeight: 600, textAlign: 'center' }}>
                              {slot.durationLabel ? `Ca ${slot.durationLabel}` : slot.duration ? `Ca ${slot.duration}` : 'Ca 30-45p'}
                            </span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: '2px', whiteSpace: 'nowrap' }}>
                              {slot.isBooked
                                ? isPending
                                  ? '⏳ Đang Chờ Duyệt'
                                  : '🔒 Đã Đặt'
                                : '🟢 Còn Trống'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', marginTop: '12px', color: 'var(--text-muted)' }}>
                      <span>🟢 Còn trống</span>
                      <span style={{ color: '#874d00' }}>⏳ Chờ duyệt (Khách gửi trước)</span>
                      <span style={{ color: '#991b1b' }}>🔒 Đã đặt</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Patient Details Form with Login Validation Check */}
              <form onSubmit={handleFormSubmit} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
                    3. Thông Tin Bệnh Nhân Đăng Ký
                  </h4>

                  {user ? (
                    <span className="badge-emerald" style={{ fontSize: '0.75rem' }}>
                      🟢 Đã Xác Thực: {user.name.split(' ')[0]}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      style={{
                        background: 'none',
                        color: 'var(--primary-emerald)',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={14} /> Đăng nhập bằng Google / Email
                    </button>
                  )}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                    rows={2}
                    className="form-textarea"
                    placeholder="Mô tả ngắn tình trạng da mụn, thâm, nám hoặc triệu chứng..."
                    value={patientInfo.notes}
                    onChange={(e) => setPatientInfo({ ...patientInfo, notes: e.target.value })}
                  />
                </div>

                {user ? (
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                    disabled={submitting}
                  >
                    {submitting ? 'ĐANG XỬ LÝ & KIỂM TRẢ TRÙNG LỊCH...' : `GỬI YÊU CẦU ĐẶT LỊCH (${serviceType} ${selectedSlot || ''})`}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '10px', opacity: 0.8 }}
                    onClick={onOpenAuth}
                  >
                    🔒 ĐĂNG NHẬP TÀI KHOẢN ĐỂ GỬI YÊU CẦU
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
