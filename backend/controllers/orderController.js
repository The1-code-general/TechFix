const { Order, OrderItem, Product, Payment } = require('../models');
const { v4: uuidv4 } = require('uuid');
const paystackService = require('../services/paystackService');
const emailService = require('../services/emailService');

const generateOrderRef = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;
    let totalAmount = 0;

    // Validate products and calculate total
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product "${item.productId}" not available.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for "${product.name}".` });
      }
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
        productSnapshot: { name: product.name, images: product.images, brand: product.brand },
      });
    }

    const order = await Order.create({
      orderRef: generateOrderRef(),
      userId: req.user.id,
      totalAmount,
      shippingAddress,
      notes,
    });

    // Create order items & deduct stock
    for (const item of orderItems) {
      await OrderItem.create({ orderId: order.id, ...item });
      await Product.decrement('stock', { by: item.quantity, where: { id: item.productId } });
    }

    // Initialize Paystack payment
    const paymentInit = await paystackService.initializePayment({
      email: req.user.email,
      amount: totalAmount,
      reference: `PAY-${order.id.slice(0, 8)}-${Date.now()}`,
      metadata: { orderId: order.id, userId: req.user.id },
    });

    await Payment.create({
      orderId: order.id,
      reference: paymentInit.reference,
      amount: totalAmount,
    });

    res.status(201).json({
      success: true,
      message: 'Order created. Proceed to payment.',
      data: { order, paymentUrl: paymentInit.authorization_url, reference: paymentInit.reference },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders (user's own orders)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['name', 'images'] }] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: { orders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        { model: Payment, as: 'payment' },
      ],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

// GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where = status ? { status } : {};
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, as: 'items' }, { model: Payment, as: 'payment' }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    res.json({ success: true, data: { orders: rows, total: count } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    await order.update({ status, ...(status === 'delivered' ? { deliveredAt: new Date() } : {}) });
    await emailService.sendOrderStatusEmail(order);
    res.json({ success: true, message: 'Order status updated.', data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
