const axios = require('axios');

const paystackAPI = axios.create({
  baseURL: process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

exports.initializePayment = async ({ email, amount, reference, metadata }) => {
  const response = await paystackAPI.post('/transaction/initialize', {
    email,
    amount: Math.round(amount * 100), // Paystack uses kobo (smallest unit)
    reference,
    metadata,
    callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
  });

  if (!response.data.status) throw new Error('Failed to initialize payment');
  return response.data.data;
};

exports.verifyPayment = async (reference) => {
  const response = await paystackAPI.get(`/transaction/verify/${reference}`);
  if (!response.data.status) throw new Error('Failed to verify payment');
  return response.data.data;
};

exports.listBanks = async () => {
  const response = await paystackAPI.get('/bank?currency=NGN');
  return response.data.data;
};
