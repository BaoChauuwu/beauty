const Appointment = require('../models/Appointment');
const { getDBStatus } = require('../config/db');

// Memory storage fallback
const memoryAppointments = [
  {
    _id: 'apt_101',
    bookingCode: 'VAN-88912',
    patientName: 'Nguyễn Văn An',
    patientPhone: '0905123456',
    patientEmail: 'nguyenvanan@gmail.com',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:30',
    skinConditionNotes: 'Tái khám mụn viêm vùng cằm và kiểm tra đơn thuốc.',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'apt_102',
    bookingCode: 'VAN-77419',
    patientName: 'Lê Thị Mai',
    patientPhone: '0914987654',
    patientEmail: 'lethimai@gmail.com',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '14:00',
    skinConditionNotes: 'Khám nám đốm vùng má sau sinh.',
    status: 'Pending',
    paymentStatus: 'Unpaid',
    createdAt: new Date().toISOString(),
  },
];

const ALL_SLOTS = [
  '08:00', '08:45', '09:30', '10:15', '11:00',
  '14:00', '14:45', '15:30', '16:15', '17:00', '18:00', '19:00'
];

const generateBookingCode = () => {
  const randNum = Math.floor(10000 + Math.random() * 90000);
  return `VAN-${randNum}`;
};

// Helper to get day of week (0: CN, 1: T2, 2: T3, 3: T4, 4: T5, 5: T6, 6: T7)
const getDayOfWeek = (dateStr) => {
  if (!dateStr) return 0;
  const parts = dateStr.split('-');
  if (parts.length < 3) return 0;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  return d.getDay();
};

// Doctor's Hourly Schedule Matrix:
// T7, CN (Sat/Sun):
//   - Làm da: 08:00, 10:30, 14:00, 15:30, 17:30, 19:30
//   - Khám mới: 10:00, 15:00, 17:00
// T2 - T6 (Mon - Fri):
//   - Làm da: 18:00
//   - Tái khám: Sau 19h30 (19:30, 20:00, 20:30)
const getScheduleForDateAndService = (dateStr, serviceType = '') => {
  const day = getDayOfWeek(dateStr);
  const isWeekend = (day === 0 || day === 6); // T7 (6) or CN (0)
  const normalized = serviceType.toLowerCase();

  if (normalized.includes('làm da') || normalized.includes('lam da') || normalized.includes('skin')) {
    if (isWeekend) {
      return ['08:00', '10:30', '14:00', '15:30', '17:30', '19:30'];
    } else {
      return ['18:00'];
    }
  }

  if (normalized.includes('khám mới') || normalized.includes('kham moi') || normalized.includes('mới')) {
    if (isWeekend) {
      return ['10:00', '15:00', '17:00'];
    } else {
      return ['17:30', '18:30'];
    }
  }

  if (normalized.includes('tái khám') || normalized.includes('tai kham') || normalized.includes('tái')) {
    if (!isWeekend) {
      return ['19:30', '20:00', '20:30'];
    } else {
      return ['09:30', '11:30', '16:30'];
    }
  }

  // Default combined slots if no specific service selected
  if (isWeekend) {
    return ['08:00', '10:00', '10:30', '14:00', '15:00', '15:30', '17:00', '17:30', '19:30'];
  } else {
    return ['18:00', '19:30', '20:00', '20:30'];
  }
};

// Helper to format slot duration (30-45 mins per session & lunch rest after 11:00)
const formatSlotDetails = (slot, serviceType = '') => {
  const normalized = serviceType.toLowerCase();
  const [hStr, mStr] = slot.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10);

  // Skin care takes 45 mins, Consultation takes 30-45 mins
  const durationMins = (normalized.includes('khám') || normalized.includes('tái')) && !normalized.includes('làm da') ? 30 : 45;

  let endM = m + durationMins;
  let endH = h;
  if (endM >= 60) {
    endH += 1;
    endM -= 60;
  }

  const endStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  const isMorningBeforeLunch = (h < 11 || (h === 10 && m === 30));

  let noteLabel = `${durationMins} phút`;
  if (slot === '10:30') {
    noteLabel = `${durationMins} phút (Nghỉ trưa sau 11h15)`;
  } else if (slot === '10:00') {
    noteLabel = `${durationMins} phút (Nghỉ trưa sau 10h45)`;
  }

  return {
    time: slot,
    displayLabel: `${slot} - ${endStr}`,
    durationLabel: noteLabel,
    duration: `${durationMins} phút`,
  };
};

// @desc    Get Calendar slot availability for a specific date & service type
// @route   GET /api/appointments/slots?date=YYYY-MM-DD&serviceType=...
exports.getSlotsByDate = async (req, res) => {
  try {
    const { date, serviceType } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const definedSlots = getScheduleForDateAndService(targetDate, serviceType || '');

    let activeAppointments = [];
    if (getDBStatus()) {
      activeAppointments = await Appointment.find({
        appointmentDate: targetDate,
        status: { $ne: 'Cancelled' },
      });
    } else {
      activeAppointments = memoryAppointments.filter(
        (a) => a.appointmentDate === targetDate && a.status !== 'Cancelled'
      );
    }

    const slotsResult = definedSlots.map((slot) => {
      const existingAppt = activeAppointments.find((a) => a.timeSlot === slot || a.timeSlot.startsWith(slot));
      const details = formatSlotDetails(slot, serviceType || '');
      return {
        ...details,
        isBooked: !!existingAppt,
        status: existingAppt ? existingAppt.status : 'Available',
        patientName: existingAppt ? existingAppt.patientName : null,
      };
    });

    const dayNum = getDayOfWeek(targetDate);
    const dayName = dayNum === 0 ? 'Chủ Nhật' : dayNum === 6 ? 'Thứ 7' : `Thứ ${dayNum + 1}`;

    return res.json({
      date: targetDate,
      dayOfWeekName: dayName,
      slots: slotsResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new appointment with Pending Validate status & Conflict Auto-Rejection
// @route   POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const {
      patientName,
      patientPhone,
      patientEmail,
      appointmentDate,
      timeSlot,
      skinConditionNotes,
      serviceType,
    } = req.body;

    if (!patientName || !patientPhone || !patientEmail || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Họ tên, SĐT, Email, Ngày và Giờ khám.' });
    }

    // First-come First-served (Ai đặt trước nhận trước, ai sau tự reject)
    let collision = null;
    if (getDBStatus()) {
      collision = await Appointment.findOne({
        appointmentDate,
        timeSlot,
        status: { $ne: 'Cancelled' },
      });
    } else {
      collision = memoryAppointments.find(
        (a) => a.appointmentDate === appointmentDate && a.timeSlot === timeSlot && a.status !== 'Cancelled'
      );
    }

    if (collision) {
      const statusText = collision.status === 'Pending' ? 'đang trong trạng thái chờ duyệt (Pending)' : 'đã được xác nhận';
      return res.status(409).json({
        conflict: true,
        message: `Khung giờ ${timeSlot} ngày ${appointmentDate} đã được bệnh nhân khác đặt trước và ${statusText}. Đơn đặt của bạn đã bị TỪ CHỐI TỰ ĐỘNG để bạn chọn khung giờ khác.`,
      });
    }

    const bookingCode = generateBookingCode();

    if (getDBStatus()) {
      const newAppointment = await Appointment.create({
        bookingCode,
        patientId: req.user ? req.user._id : null,
        patientName,
        patientPhone,
        patientEmail,
        doctorId: req.body.doctorId || '60d0fe4f5311236168a109ca',
        serviceId: req.body.serviceId || '60d0fe4f5311236168a109cb',
        appointmentDate,
        timeSlot,
        skinConditionNotes: skinConditionNotes || '',
        status: 'Pending', // Pending Validate chờ duyệt lịch
        paymentStatus: 'Unpaid',
      });

      return res.status(201).json({
        message: 'Đặt lịch khám thành công! Lịch hẹn đang ở trạng thái Chờ Duyệt Lịch (Pending Validate).',
        appointment: newAppointment,
      });
    } else {
      const newAppt = {
        _id: 'apt_' + Date.now(),
        bookingCode,
        patientId: req.user ? req.user.id || 'usr_demo' : null,
        patientName,
        patientPhone,
        patientEmail,
        appointmentDate,
        timeSlot,
        skinConditionNotes: skinConditionNotes || '',
        status: 'Pending', // Pending Validate chờ duyệt lịch
        paymentStatus: 'Unpaid',
        createdAt: new Date().toISOString(),
      };
      memoryAppointments.unshift(newAppt);

      return res.status(201).json({
        message: 'Đặt lịch khám thành công! Lịch hẹn đang ở trạng thái Chờ Duyệt Lịch (Pending Validate).',
        appointment: newAppt,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo lịch hẹn: ' + error.message });
  }
};

// @desc    Get all appointments for Doctor Calendar View
// @route   GET /api/appointments
exports.getAppointments = async (req, res) => {
  try {
    const { date, month } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (date) {
        query.appointmentDate = date;
      } else if (month) {
        query.appointmentDate = { $regex: `^${month}` };
      }

      const appointments = await Appointment.find(query).sort({ appointmentDate: 1, timeSlot: 1 });
      return res.json(appointments);
    } else {
      let filtered = memoryAppointments;
      if (date) {
        filtered = memoryAppointments.filter((a) => a.appointmentDate === date);
      } else if (month) {
        filtered = memoryAppointments.filter((a) => a.appointmentDate.startsWith(month));
      }
      return res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient appointments by logged in user or query
// @desc    Get patient appointments by logged in user, email, phone or code
// @route   GET /api/appointments/my-appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const { phone, code, email } = req.query;

    if (!phone && !code && !email) {
      return res.json([]);
    }

    if (getDBStatus()) {
      let queryOr = [];
      if (email) queryOr.push({ patientEmail: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (phone) queryOr.push({ patientPhone: phone });
      if (code) queryOr.push({ bookingCode: code.toUpperCase() });

      const appointments = await Appointment.find({ $or: queryOr }).sort({ createdAt: -1 });
      return res.json(appointments);
    } else {
      const filtered = memoryAppointments.filter((a) => {
        if (email && a.patientEmail && a.patientEmail.toLowerCase() === email.toLowerCase()) return true;
        if (phone && a.patientPhone && a.patientPhone.includes(phone)) return true;
        if (code && a.bookingCode && a.bookingCode.toUpperCase() === code.toUpperCase()) return true;
        return false;
      });
      return res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (Confirming auto-cancels any conflicting pending appts)
// @route   PUT /api/appointments/:id/status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, adminNotes } = req.body;

    if (getDBStatus()) {
      const appt = await Appointment.findById(id);
      if (!appt) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn.' });

      if (status) appt.status = status;
      if (paymentStatus) appt.paymentStatus = paymentStatus;
      if (adminNotes !== undefined) appt.adminNotes = adminNotes;
      await appt.save();

      // If approved, auto-cancel any conflicting pending appointments for the same date & slot
      if (status === 'Confirmed') {
        await Appointment.updateMany(
          {
            _id: { $ne: appt._id },
            appointmentDate: appt.appointmentDate,
            timeSlot: appt.timeSlot,
            status: 'Pending',
          },
          {
            $set: {
              status: 'Cancelled',
              adminNotes: 'Tự động hủy do đã duyệt ca khám cho bệnh nhân trước.',
            },
          }
        );
      }

      return res.json(appt);
    } else {
      const appt = memoryAppointments.find((a) => a._id === id);
      if (appt) {
        if (status) appt.status = status;
        if (paymentStatus) appt.paymentStatus = paymentStatus;
        if (adminNotes !== undefined) appt.adminNotes = adminNotes;

        if (status === 'Confirmed') {
          memoryAppointments.forEach((a) => {
            if (a._id !== id && a.appointmentDate === appt.appointmentDate && a.timeSlot === appt.timeSlot && a.status === 'Pending') {
              a.status = 'Cancelled';
              a.adminNotes = 'Tự động hủy do đã duyệt ca khám cho bệnh nhân trước.';
            }
          });
        }

        return res.json(appt);
      }
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
