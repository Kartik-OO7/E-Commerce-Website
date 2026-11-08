const router = require('express').Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?search=&category=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { search = '', category = '', page = 1, limit = 12 } = req.query;
    const q = {};
    if (search) q.name = { $regex: escapeRegex(String(search)), $options: 'i' };
    if (category) q.category = String(category);
    const p = Math.max(1, parseInt(page) || 1), l = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const [products, total, categories] = await Promise.all([
      Product.find(q).sort('-createdAt').skip((p - 1) * l).limit(l),
      Product.countDocuments(q),
      Product.distinct('category'),
    ]);
    res.json({ products, total, pages: Math.ceil(total / l), page: p, categories });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch { res.status(404).json({ message: 'Product not found' }); }
});

// Bonus: admin can add products
router.post('/', protect, admin, async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); }
});

module.exports = router;
