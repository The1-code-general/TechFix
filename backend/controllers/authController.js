const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const emailService = require('../services/emailService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ firstName, lastName, email, password, phone, emailVerifyToken: verifyToken });

    await emailService.sendWelcomeEmail(user, verifyToken);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      data: { user, token: generateToken(user.id) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, token: generateToken(user.id) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await user.update({
      resetPasswordToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
      resetPasswordExpires: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    await emailService.sendPasswordResetEmail(user, resetToken);
    res.json({ success: true, message: 'Password reset email sent.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const { Op } = require('sequelize');
    const user = await User.findOne({
      where: { resetPasswordToken: hashed, resetPasswordExpires: { [Op.gt]: Date.now() } },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });

    await user.update({ password: req.body.password, resetPasswordToken: null, resetPasswordExpires: null });
    res.json({ success: true, message: 'Password reset successful. Please log in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/auth/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    await req.user.update({ firstName, lastName, phone, address });
    res.json({ success: true, message: 'Profile updated.', data: { user: req.user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!(await req.user.validatePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    await req.user.update({ password: newPassword });
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
