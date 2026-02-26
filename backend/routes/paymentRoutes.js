const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/paymentController');

// Paystack webhook - raw body needed for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), paymentCtrl.paystackWebhook);
router.get('/verify/:reference', paymentCtrl.verifyPayment);

module.exports = router;
