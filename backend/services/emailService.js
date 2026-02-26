const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"${process.env.EMAIL_FROM_NAME || 'TechFix'}" <${process.env.EMAIL_FROM}>`;

const send = async (to, subject, html) => {
  await transporter.sendMail({ from: FROM, to, subject, html });
};

exports.sendWelcomeEmail = async (user, verifyToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
  await send(user.email, 'Welcome to TechFix! Verify your email', `
    <h2>Welcome, ${user.firstName}!</h2>
    <p>Thank you for registering with TechFix.</p>
    <p>Please verify your email address by clicking the button below:</p>
    <a href="${verifyUrl}" style="background:#0066cc;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">Verify Email</a>
    <p>If you didn't register, you can ignore this email.</p>
  `);
};

exports.sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await send(user.email, 'TechFix - Password Reset Request', `
    <h2>Password Reset</h2>
    <p>You requested a password reset. Click the button below (valid for 10 minutes):</p>
    <a href="${resetUrl}" style="background:#dc3545;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  `);
};

exports.sendOrderConfirmationEmail = async (order) => {
  await send(order.shippingAddress?.email || '', `Order Confirmed - ${order.orderRef}`, `
    <h2>Order Confirmed!</h2>
    <p>Thank you for your order. Your order reference is: <strong>${order.orderRef}</strong></p>
    <p>Total Amount: <strong>₦${Number(order.totalAmount).toLocaleString()}</strong></p>
    <p>We will notify you when your order is shipped.</p>
    <a href="${process.env.FRONTEND_URL}/orders/${order.id}">View Order</a>
  `);
};

exports.sendOrderStatusEmail = async (order) => {
  await send(order.shippingAddress?.email || '', `Order Update - ${order.orderRef}`, `
    <h2>Order Status Update</h2>
    <p>Your order <strong>${order.orderRef}</strong> status has been updated to: <strong>${order.status.toUpperCase()}</strong></p>
    <a href="${process.env.FRONTEND_URL}/orders/${order.id}">Track Your Order</a>
  `);
};

exports.sendRepairConfirmationEmail = async (booking) => {
  await send(booking.customerEmail, `Repair Booking Confirmed - ${booking.ticketRef}`, `
    <h2>Repair Booking Confirmed!</h2>
    <p>Dear ${booking.customerName},</p>
    <p>Your repair booking has been received. Your ticket reference is: <strong>${booking.ticketRef}</strong></p>
    <p><strong>Device:</strong> ${booking.deviceType} ${booking.deviceBrand || ''} ${booking.deviceModel || ''}</p>
    <p><strong>Issue:</strong> ${booking.issueType}</p>
    <p>You can track your repair status at any time using your ticket reference.</p>
    <a href="${process.env.FRONTEND_URL}/track-repair?ticket=${booking.ticketRef}" style="background:#28a745;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">Track Repair</a>
  `);
};

exports.sendRepairStatusEmail = async (booking) => {
  await send(booking.customerEmail, `Repair Update - ${booking.ticketRef}`, `
    <h2>Repair Status Update</h2>
    <p>Dear ${booking.customerName},</p>
    <p>Your repair ticket <strong>${booking.ticketRef}</strong> status has been updated to: <strong>${booking.status.replace('_', ' ').toUpperCase()}</strong></p>
    ${booking.technicianNotes ? `<p><strong>Notes:</strong> ${booking.technicianNotes}</p>` : ''}
    ${booking.estimatedCost ? `<p><strong>Estimated Cost:</strong> ₦${Number(booking.estimatedCost).toLocaleString()}</p>` : ''}
    <a href="${process.env.FRONTEND_URL}/track-repair?ticket=${booking.ticketRef}">Track Repair</a>
  `);
};
