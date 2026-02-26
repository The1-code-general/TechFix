const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const orderCtrl = require('../controllers/orderController');
const repairCtrl = require('../controllers/repairController');
const productCtrl = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');

// All admin routes require auth + admin role
router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/dashboard', adminCtrl.getDashboardStats);

// Users
router.get('/users', adminCtrl.getUsers);
router.patch('/users/:id/block', adminCtrl.toggleBlockUser);

// Products
router.post('/products', uploadProductImages, productCtrl.createProduct);
router.put('/products/:id', uploadProductImages, productCtrl.updateProduct);
router.delete('/products/:id', productCtrl.deleteProduct);

// Orders
router.get('/orders', orderCtrl.getAllOrders);
router.patch('/orders/:id/status', orderCtrl.updateOrderStatus);

// Repairs
router.get('/repairs', repairCtrl.getAllBookings);
router.patch('/repairs/:id', repairCtrl.updateBooking);

// Categories
const { Category } = require('../models');
const slugify = require('../utils/slugify');

router.post('/categories', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const slug = await slugify(name, Category);
    const category = await Category.create({ name, slug, description, image });
    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    await category.update(req.body);
    res.json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
