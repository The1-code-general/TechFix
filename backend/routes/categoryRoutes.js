const express = require('express');
const router = express.Router();
const { Category } = require('../models');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
    res.json({ success: true, data: { categories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
