const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/repairs', require('./repairRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
