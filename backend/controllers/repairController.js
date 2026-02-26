const { RepairBooking, User } = require('../models');
const emailService = require('../services/emailService');

const generateTicketRef = () => `REP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

// POST /api/repairs
exports.createBooking = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, deviceType, deviceBrand, deviceModel, issueType, issueDescription } = req.body;
    const deviceImages = req.files ? req.files.map(f => `/uploads/repairs/${f.filename}`) : [];

    const booking = await RepairBooking.create({
      ticketRef: generateTicketRef(),
      userId: req.user?.id || null,
      customerName, customerEmail, customerPhone,
      deviceType, deviceBrand, deviceModel,
      issueType, issueDescription, deviceImages,
    });

    await emailService.sendRepairConfirmationEmail(booking);
    res.status(201).json({
      success: true,
      message: 'Repair booking submitted. You will receive a confirmation email.',
      data: { booking },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/repairs/track/:ticketRef (public)
exports.trackRepair = async (req, res) => {
  try {
    const booking = await RepairBooking.findOne({ where: { ticketRef: req.params.ticketRef } });
    if (!booking) return res.status(404).json({ success: false, message: 'Ticket not found.' });

    res.json({
      success: true,
      data: {
        ticketRef: booking.ticketRef,
        status: booking.status,
        deviceType: booking.deviceType,
        issueType: booking.issueType,
        estimatedCost: booking.estimatedCost,
        estimatedCompletion: booking.estimatedCompletion,
        completedAt: booking.completedAt,
        technicianNotes: booking.technicianNotes,
        createdAt: booking.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/repairs/my (authenticated user)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await RepairBooking.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: { bookings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

// GET /api/admin/repairs
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};
    const { count, rows } = await RepairBooking.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    res.json({ success: true, data: { bookings: rows, total: count } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/repairs/:id
exports.updateBooking = async (req, res) => {
  try {
    const booking = await RepairBooking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    const updates = { ...req.body };
    if (updates.status === 'completed') updates.completedAt = new Date();

    await booking.update(updates);
    await emailService.sendRepairStatusEmail(booking);
    res.json({ success: true, message: 'Repair booking updated.', data: { booking } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
