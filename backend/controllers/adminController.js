const { User, Order, RepairBooking, Product, Payment, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalOrders,
      totalRepairs,
      totalProducts,
      pendingOrders,
      pendingRepairs,
      monthlyRevenue,
      recentOrders,
      recentRepairs,
    ] = await Promise.all([
      User.count({ where: { role: 'customer' } }),
      Order.count(),
      RepairBooking.count(),
      Product.count({ where: { isActive: true } }),
      Order.count({ where: { status: 'pending' } }),
      RepairBooking.count({ where: { status: 'pending' } }),
      Payment.sum('amount', { where: { status: 'success', paidAt: { [Op.gte]: monthStart } } }),
      Order.findAll({ limit: 5, order: [['createdAt', 'DESC']] }),
      RepairBooking.findAll({ limit: 5, order: [['createdAt', 'DESC']] }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalOrders,
          totalRepairs,
          totalProducts,
          pendingOrders,
          pendingRepairs,
          monthlyRevenue: monthlyRevenue || 0,
        },
        recentOrders,
        recentRepairs,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const where = role ? { role } : {};
    const { count, rows } = await User.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    res.json({ success: true, data: { users: rows, total: count } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/users/:id/block
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    await user.update({ isBlocked: !user.isBlocked });
    res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}.`, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
