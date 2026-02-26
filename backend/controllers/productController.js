const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const slugify = require('../utils/slugify');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, minPrice, maxPrice, brand, sort = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const where = { isActive: true };

    if (search) where.name = { [Op.like]: `%${search}%` };
    if (brand) where.brand = { [Op.like]: `%${brand}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const include = [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }];
    if (category) include[0].where = { slug: category };

    const { count, rows } = await Product.findAndCountAll({
      where, include, limit: parseInt(limit), offset: parseInt(offset),
      order: [[sort, order.toUpperCase()]],
    });

    res.json({
      success: true,
      data: {
        products: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:slug
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [{ model: Category, as: 'category' }],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/products
exports.createProduct = async (req, res) => {
  try {
    const { name, categoryId, description, price, stock, brand, model, specifications, isFeatured, sku } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/products/${f.filename}`) : [];
    const slug = await slugify(name, Product);

    const product = await Product.create({ name, slug, categoryId, description, price, stock, brand, model, specifications: JSON.parse(specifications || '{}'), isFeatured: isFeatured === 'true', sku, images });
    res.status(201).json({ success: true, message: 'Product created.', data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(f => `/uploads/products/${f.filename}`);
    }
    if (updates.name && updates.name !== product.name) {
      updates.slug = await slugify(updates.name, Product);
    }
    await product.update(updates);
    res.json({ success: true, message: 'Product updated.', data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    await product.update({ isActive: false }); // Soft delete
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isFeatured: true, isActive: true },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      limit: 8,
    });
    res.json({ success: true, data: { products } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
