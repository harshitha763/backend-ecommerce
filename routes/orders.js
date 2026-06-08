const express = require('express');
const { Order, Cart } = require('../database');
const { auth } = require('./auth');
const router  = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { address, payment } = req.body;
    if (!address || !payment) return res.status(400).json({ error: 'Address and payment required' });

    const cartItems = await Cart.find({ user: req.user.id }).populate('product');
    if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

    const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
    const tax      = Math.round(subtotal * 0.05);
    const total    = subtotal + tax;
    const orderRef = 'FC' + Date.now();

    const order = await Order.create({
      user: req.user.id, orderRef, address, payment, subtotal, tax, total,
      items: cartItems.map(i => ({
        product: i.product._id, name: i.product.name,
        price: i.product.price, qty: i.qty, size: i.size, image: i.product.image
      }))
    });

    await Cart.deleteMany({ user: req.user.id });
    res.status(201).json({ message: 'Order placed', orderId: order._id, orderRef });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'Confirmed') return res.status(400).json({ error: 'Only confirmed orders can be cancelled' });
    order.status = 'Cancelled';
    await order.save();
    res.json({ message: 'Order cancelled' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
