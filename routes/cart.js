const express = require('express');
const { Cart, Product } = require('../database');
const { auth } = require('./auth');
const router  = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const items = await Cart.find({ user: req.user.id }).populate('product');
    res.json(items.map(i => ({
      id: i._id, qty: i.qty, size: i.size, color: i.color,
      product_id: i.product._id, name: i.product.name,
      price: i.product.price, original_price: i.product.original_price,
      image: i.product.image, category: i.product.category
    })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, qty = 1, size = '', color = '' } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const existing = await Cart.findOne({ user: req.user.id, product: productId, size, color });
    if (existing) {
      existing.qty += qty;
      await existing.save();
    } else {
      await Cart.create({ user: req.user.id, product: productId, qty, size, color });
    }
    res.json({ message: 'Added to cart' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { qty } = req.body;
    if (qty <= 0) {
      await Cart.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      return res.json({ message: 'Removed' });
    }
    await Cart.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { qty });
    res.json({ message: 'Updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Removed' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
