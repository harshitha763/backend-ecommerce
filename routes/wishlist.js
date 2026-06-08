const express = require('express');
const { Wishlist } = require('../database');
const { auth } = require('./auth');
const router  = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id }).populate('product');
    res.json(items.map(i => i.product));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/ids', auth, async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id });
    res.json(items.map(i => i.product.toString()));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const existing = await Wishlist.findOne({ user: req.user.id, product: productId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ action: 'removed' });
    }
    await Wishlist.create({ user: req.user.id, product: productId });
    res.json({ action: 'added' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Wishlist.deleteMany({ user: req.user.id });
    res.json({ message: 'Wishlist cleared' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
