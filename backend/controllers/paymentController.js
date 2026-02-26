const crypto = require('crypto');
const { Payment, Order } = require('../models');
const paystackService = require('../services/paystackService');
const emailService = require('../services/emailService');

// POST /api/payments/webhook (Paystack webhook)
exports.paystackWebhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;

      const payment = await Payment.findOne({ where: { reference } });
      if (!payment) return res.sendStatus(200);

      await payment.update({
        status: 'success',
        paystackReference: event.data.id,
        channel: event.data.channel,
        gatewayResponse: event.data.gateway_response,
        paidAt: new Date(event.data.paid_at),
        metadata: event.data,
      });

      const order = await Order.findByPk(payment.orderId);
      if (order) {
        await order.update({ paymentStatus: 'paid', status: 'confirmed' });
        await emailService.sendOrderConfirmationEmail(order);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
};

// GET /api/payments/verify/:reference
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const result = await paystackService.verifyPayment(reference);

    if (result.status === 'success') {
      const payment = await Payment.findOne({ where: { reference } });
      if (payment && payment.status !== 'success') {
        await payment.update({ status: 'success', paidAt: new Date() });
        const order = await Order.findByPk(payment.orderId);
        if (order) await order.update({ paymentStatus: 'paid', status: 'confirmed' });
      }
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
