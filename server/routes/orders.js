const router = require('express').Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Price is always read from DB, never trusted from the client
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shipping, paymentMethod } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Cart is empty' });
    const s = shipping || {};
    if (!s.fullName || !s.address || !s.city || !s.postalCode || !s.phone)
      return res.status(400).json({ message: 'Complete shipping details required' });

    const lines = [];
    let total = 0;
    for (const it of items) {
      const qty = parseInt(it.qty);
      const prod = await Product.findById(it.product).catch(() => null);
      if (!prod || !(qty > 0)) return res.status(400).json({ message: 'Invalid item in cart' });
      if (prod.stock < qty) return res.status(400).json({ message: `Only ${prod.stock} left of ${prod.name}` });
      lines.push({ product: prod._id, name: prod.name, price: prod.price, qty });
      total += prod.price * qty;
    }
    for (const l of lines) await Product.updateOne({ _id: l.product }, { $inc: { stock: -l.qty } });
    const order = await Order.create({
      user: req.user._id, items: lines, shipping: s,
      paymentMethod: paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD', total,
    });
    res.status(201).json(order);
  } catch (e) { next(e); }
});

router.get('/mine', protect, async (req, res, next) => {
  try { res.json(await Order.find({ user: req.user._id }).sort('-createdAt')); } catch (e) { next(e); }
});

module.exports = router;
