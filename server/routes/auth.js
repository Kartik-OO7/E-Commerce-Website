const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = (u) => ({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin, token: sign(u._id) });
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e);

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !emailOk(email) || !password || password.length < 6)
      return res.status(400).json({ message: 'Valid name, email and password (min 6 chars) required' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json(out(user));
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(String(password || ''))))
      return res.status(401).json({ message: 'Wrong email or password' });
    res.json(out(user));
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json(req.user));
module.exports = router;
