const express = require('express');
const { Contact } = require('../database');
const router  = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ error: 'name, email, subject and message are required' });
    await Contact.create({ name, email, phone: phone || '', subject, message });
    res.status(201).json({ message: 'Message received. We will get back to you within 24 hours.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
