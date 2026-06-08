require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { connectDB, seedProducts } = require('./database');

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = [
      /^https?:\/\/localhost(:\d+)?$/,
      /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
      /\.vercel\.app$/,
      /\.netlify\.app$/,
      /\.render\.com$/,
      /\.railway\.app$/,
    ];
    if (allowed.some(p => p.test(origin))) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

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

// 404 for unknown API routes
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(seedProducts).then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 FashionCart API running at http://localhost:${PORT}`);
    console.log(`   Health → http://localhost:${PORT}/api/health\n`);
  });
}).catch(err => {
  console.error('\n❌ Failed to connect to MongoDB Atlas!');
  console.error('   Error:', err.message);
  process.exit(1);
});

module.exports = app;
