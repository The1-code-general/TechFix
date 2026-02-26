const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');

router.get('/', productCtrl.getProducts);
router.get('/featured', productCtrl.getFeaturedProducts);
router.get('/:slug', productCtrl.getProduct);

module.exports = router;
