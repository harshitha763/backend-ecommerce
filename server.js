require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { connectDB, seedProducts } = require('./database');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { router: authRouter } = require('./routes/auth');
app.use('/api/auth',     authRouter);
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/contact',  require('./routes/contact'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.get('/', (req, res) => res.json({
  message: '🚀 FashionCart API is live!',
  endpoints: ['/api/health', '/api/products', '/api/auth/login']
}));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: 'Internal server error' }); });

const PORT = process.env.PORT || 3000;

connectDB().then(seedProducts).then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 FashionCart API running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ DB connection failed:', err.message);
  process.exit(1);
});

module.exports = app;
