// ─── orderRoutes.js ──────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, orderCtrl.createOrder);
router.get('/my', authenticate, orderCtrl.getMyOrders);
router.get('/:id', authenticate, orderCtrl.getOrder);

module.exports = router;
