const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { User } = require('../database');
const router  = express.Router();

const SECRET = process.env.JWT_SECRET || 'fallback_secret';

function makeToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '7d' });
}

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(header.split(' ')[1], SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (await User.findOne({ email }))
      return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, phone, password: hash });
    res.status(201).json({ token: makeToken(user), user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ token: makeToken(user), user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, gender: user.gender, address: user.address, createdAt: user.createdAt });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, gender } = req.body;
    await User.findByIdAndUpdate(req.user.id, { firstName, lastName, phone, gender });
    res.json({ message: 'Profile updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/address', auth, async (req, res) => {
  try {
    const { line1, line2, city, state, pin } = req.body;
    await User.findByIdAndUpdate(req.user.id, { address: { line1, line2, city, state, pin } });
    res.json({ message: 'Address updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!await bcrypt.compare(currentPassword, user.password))
      return res.status(400).json({ error: 'Current password is incorrect' });
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = { router, auth };
