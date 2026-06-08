const express = require('express');
const { Product } = require('../database');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const { tag, search, sort } = req.query;
    const query = {};
    if (tag && tag !== 'all') query.tag = tag;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { category: new RegExp(search, 'i') }];

    const sortMap = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, 'name': { name: 1 } };
    const products = await Product.find(query).sort(sortMap[sort] || { createdAt: 1 });
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
