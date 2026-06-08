const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI, { tlsAllowInvalidCertificates: true });
  console.log('✅ MongoDB connected:', process.env.MONGO_URI.split('@')[1].split('/')[0]);
}

// ── Schemas ───────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, default: '' },
  password:  { type: String, required: true },
  gender:    { type: String, default: '' },
  address:   { line1: String, line2: String, city: String, state: String, pin: String }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  price:          { type: Number, required: true },
  original_price: { type: Number, required: true },
  image:          { type: String, required: true },
  category:       { type: String, required: true },
  tag:            { type: String, required: true },
  badge:          { type: String, default: '' },
  description:    { type: String, default: '' },
  stock:          { type: Number, default: 100 }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty:     { type: Number, default: 1 },
  size:    { type: String, default: '' },
  color:   { type: String, default: '' }
});

const wishlistSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
});
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String, price: Number, qty: Number,
  size: { type: String, default: '' },
  image: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderRef: { type: String, unique: true },
  status:   { type: String, default: 'Confirmed' },
  address:  String, payment: String,
  subtotal: Number, tax: Number, total: Number,
  items:    [orderItemSchema]
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

// ── Models ────────────────────────────────────────────────────────
const User     = mongoose.model('User',     userSchema);
const Product  = mongoose.model('Product',  productSchema);
const Cart     = mongoose.model('Cart',     cartSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Order    = mongoose.model('Order',    orderSchema);
const Contact  = mongoose.model('Contact',  contactSchema);

// ── Seed Products ─────────────────────────────────────────────────
async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  await Product.insertMany([
    // Women
    { name:'Floral Midi Dress',       price:1200, original_price:1800, image:'https://images.unsplash.com/photo-1496747611176-84322e1e57c?q=80&w=687&auto=format&fit=crop',  category:'Women', tag:'women', badge:'New',     description:'Beautiful floral midi dress perfect for summer outings.' },
    { name:'Summer Crop Top',         price:600,  original_price:900,  image:'https://images.unsplash.com/photo-1583496661160-fb5218f5f46e?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Sale',    description:'Light and breezy summer crop top in soft cotton.' },
    { name:'Evening Gown',            price:3200, original_price:4500, image:'https://images.unsplash.com/photo-1595777712802-6b7be0a54341?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Premium', description:'Elegant evening gown for special occasions.' },
    { name:'Winter Coat',             price:4500, original_price:6000, image:'https://images.unsplash.com/photo-1539533057440-7fc97eab7527?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'New',     description:'Warm and stylish winter coat with wool blend.' },
    { name:'Casual Kurti',            price:850,  original_price:1200, image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Hot',     description:'Comfortable cotton kurti for daily wear.' },
    { name:'Pleated Skirt',           price:950,  original_price:1400, image:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'',        description:'Elegant pleated skirt for all occasions.' },
    { name:'Blazer for Women',        price:2800, original_price:3800, image:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'New',     description:'Sharp blazer perfect for office and parties.' },
    { name:'Silk Saree',              price:5500, original_price:7500, image:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Premium', description:'Pure silk saree with elegant zari border.' },
    { name:'Palazzo Pants',           price:799,  original_price:1100, image:'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Sale',    description:'Wide-leg palazzo pants for relaxed comfort.' },
    { name:'Boho Maxi Dress',         price:1500, original_price:2200, image:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Hot',     description:'Free-spirited boho maxi dress with ethnic prints.' },
    { name:'Wrap Dress',              price:1400, original_price:2000, image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'New',     description:'Flattering wrap dress for work and evenings.' },
    { name:'Linen Shirt Dress',       price:1100, original_price:1600, image:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'',        description:'Casual linen shirt dress for daywear.' },
    { name:'Ruffle Blouse',           price:750,  original_price:1100, image:'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=687&auto=format&fit=crop',   category:'Women', tag:'women', badge:'Sale',    description:'Chic ruffle blouse with feminine detailing.' },
    { name:'High Waist Trousers',     price:1300, original_price:1900, image:'https://images.unsplash.com/photo-1548549557-dbe9946621da?q=80&w=687&auto=format&fit=crop',   category:'Women', tag:'women', badge:'',        description:'Sleek high-waist trousers for a polished look.' },
    { name:'Off Shoulder Top',        price:699,  original_price:999,  image:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Hot',     description:'Trendy off-shoulder top for summer styling.' },
    { name:'Velvet Midi Dress',       price:2200, original_price:3200, image:'https://images.unsplash.com/photo-1566479179817-c3f20012b6c3?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Premium', description:'Luxurious velvet midi dress for evening events.' },
    { name:'Flared Jeans Women',      price:1599, original_price:2200, image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'New',     description:'Stylish flared jeans for a retro-chic look.' },
    { name:'Spaghetti Strap Dress',   price:999,  original_price:1400, image:'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'',        description:'Effortless spaghetti strap sundress.' },
    { name:'Knit Cardigan',           price:1800, original_price:2400, image:'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=687&auto=format&fit=crop',   category:'Women', tag:'women', badge:'Sale',    description:'Cozy button-front cardigan sweater for layering.' },
    { name:'Printed Midi Skirt',      price:1100, original_price:1500, image:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'',        description:'Vibrant printed midi skirt for a fun look.' },

    // Men
    { name:'Classic White T-Shirt',   price:800,  original_price:1000, image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'Sale',    description:'Premium 100% cotton classic white t-shirt.' },
    { name:'Leather Jacket',          price:5500, original_price:7500, image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=687&auto=format&fit=crop',   category:'Men', tag:'men', badge:'Hot',     description:'Genuine leather jacket for a bold look.' },
    { name:'Slim Fit Chinos',         price:1500, original_price:2000, image:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'',        description:'Slim-fit chinos for casual and semi-formal wear.' },
    { name:'Polo Shirt',              price:1000, original_price:1200, image:'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'',        description:'Classic polo shirt with premium cotton fit.' },
    { name:'Formal Shirt',            price:1200, original_price:1700, image:'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'New',     description:'Crisp formal shirt for office and events.' },
    { name:'Men Kurta',               price:1100, original_price:1500, image:'https://images.unsplash.com/photo-1614252234498-2ce4a26b1e5d?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'Hot',     description:'Traditional cotton kurta for festive occasions.' },
    { name:'Hoodie Sweatshirt',       price:1800, original_price:2500, image:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=687&auto=format&fit=crop',   category:'Men', tag:'men', badge:'Sale',    description:'Cozy fleece hoodie for cool days.' },
    { name:'Cargo Pants',             price:1600, original_price:2200, image:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'New',     description:'Rugged cargo pants with multiple pockets.' },
    { name:'Blazer for Men',          price:3500, original_price:5000, image:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'Premium', description:'Tailored blazer for a sharp professional look.' },
    { name:'Oxford Button Down',      price:1400, original_price:1900, image:'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'',        description:'Classic Oxford button-down for smart casual.' },
    { name:'Linen Casual Shirt',      price:1100, original_price:1600, image:'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'New',     description:'Breathable linen shirt for warm weather.' },
    { name:'Denim Shirt',             price:1300, original_price:1800, image:'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=687&auto=format&fit=crop',   category:'Men', tag:'men', badge:'',        description:'Versatile denim shirt for layered looks.' },
    { name:'Bomber Jacket',           price:3200, original_price:4500, image:'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=687&auto=format&fit=crop',   category:'Men', tag:'men', badge:'Hot',     description:'Stylish bomber jacket with ribbed cuffs.' },
    { name:'Henley T-Shirt',          price:899,  original_price:1200, image:'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'Sale',    description:'Casual henley with button placket detail.' },
    { name:'Tailored Trousers',       price:2200, original_price:3000, image:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'New',     description:'Sharp tailored trousers for formal occasions.' },

    // Kids
    { name:'Kids Denim Dungaree',     price:699,  original_price:999,  image:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'New',  description:'Adorable denim dungaree for little ones.' },
    { name:'Girls Frock',             price:550,  original_price:800,  image:'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'Sale', description:'Cute printed frock for girls.' },
    { name:'Boys Casual Tee',         price:399,  original_price:599,  image:'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'Hot',  description:'Fun graphic tee for active boys.' },
    { name:'Kids Winter Jacket',      price:1200, original_price:1800, image:'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'',     description:'Warm padded jacket to keep kids cozy.' },
    { name:'Kids Tracksuit',          price:799,  original_price:1100, image:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'New',  description:'Comfortable tracksuit for active kids.' },
    { name:'Girls Party Dress',       price:850,  original_price:1200, image:'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'Hot',  description:'Beautiful party dress for little girls.' },
    { name:'Boys Printed Shirt',      price:450,  original_price:650,  image:'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'Sale', description:'Fun printed shirt for boys.' },
    { name:'Kids Hoodie',             price:699,  original_price:950,  image:'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'',     description:'Super soft hoodie for cool days.' },

    // Unisex
    { name:'Casual Denim Jeans',      price:1500, original_price:1900, image:'https://images.unsplash.com/photo-1542272604-787c62d465d1?q=80&w=687&auto=format&fit=crop',   category:'Unisex', tag:'unisex', badge:'',     description:'Classic blue jeans with perfect fit.' },
    { name:'Denim Jacket',            price:2200, original_price:2800, image:'https://images.unsplash.com/photo-1516762714551-8f157d9e1b07?q=80&w=687&auto=format&fit=crop', category:'Unisex', tag:'unisex', badge:'New',  description:'Versatile denim jacket for any season.' },
    { name:'Sneakers',                price:2800, original_price:3500, image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=687&auto=format&fit=crop',   category:'Unisex', tag:'unisex', badge:'Hot',  description:'Trendy sneakers with superior comfort.' },
    { name:'Graphic Sweatshirt',      price:1400, original_price:2000, image:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=687&auto=format&fit=crop', category:'Unisex', tag:'unisex', badge:'Sale', description:'Trendy graphic sweatshirt for all genders.' },
    { name:'Track Pants',             price:999,  original_price:1400, image:'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=687&auto=format&fit=crop', category:'Unisex', tag:'unisex', badge:'',     description:'Relaxed track pants for workout or lounging.' },
    { name:'Zip-Up Hoodie',           price:1600, original_price:2200, image:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=687&auto=format&fit=crop',   category:'Unisex', tag:'unisex', badge:'New',  description:'Cozy zip-up hoodie for everyday wear.' },
    { name:'Jogger Pants',            price:1100, original_price:1500, image:'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=687&auto=format&fit=crop', category:'Unisex', tag:'unisex', badge:'Sale', description:'Comfortable jogger pants for active lifestyle.' },

    // Ethnic
    { name:'Anarkali Suit',           price:2200, original_price:3200, image:'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'New',     description:'Gorgeous anarkali suit for festive occasions.' },
    { name:'Sherwani',                price:6500, original_price:9000, image:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Premium', description:'Royal sherwani for weddings and ceremonies.' },
    { name:'Lehenga Choli',           price:4800, original_price:7000, image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Hot',     description:'Stunning lehenga choli for weddings.' },
    { name:'Dhoti Kurta Set',         price:1800, original_price:2500, image:'https://images.unsplash.com/photo-1614252234498-2ce4a26b1e5d?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'',        description:'Traditional dhoti kurta set for festivals.' },
    { name:'Bandhani Saree',          price:3200, original_price:4500, image:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'New',     description:'Vibrant Bandhani saree with traditional prints.' },
    { name:'Salwar Kameez',           price:1500, original_price:2100, image:'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Sale',    description:'Classic salwar kameez for everyday ethnic wear.' },
    { name:'Indo-Western Jacket',     price:2800, original_price:3800, image:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Hot',     description:'Stylish indo-western jacket combining cultures.' },
    { name:'Banarasi Silk Saree',     price:7500, original_price:10000,image:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Premium', description:'Exquisite Banarasi silk saree with zari work.' },

    // Accessories
    { name:'Leather Belt',            price:700,  original_price:900,  image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'',       description:'Genuine leather belt with classic buckle.' },
    { name:'Sun Hat',                 price:500,  original_price:700,  image:'https://images.unsplash.com/photo-1506629082632-32ca5dff2e48?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Sale',    description:'Wide-brim sun hat for ultimate protection.' },
    { name:'Tote Bag',                price:1200, original_price:1600, image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=687&auto=format&fit=crop',   category:'Accessories', tag:'accessories', badge:'New',     description:'Spacious canvas tote bag for everyday use.' },
    { name:'Sunglasses',              price:1500, original_price:2200, image:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Hot',     description:'UV-protected stylish sunglasses.' },
    { name:'Wrist Watch',             price:3500, original_price:5000, image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Premium', description:'Elegant wrist watch with stainless steel strap.' },
    { name:'Scarf',                   price:450,  original_price:650,  image:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'',       description:'Soft and warm scarf for winters.' },
    { name:'Leather Handbag',         price:2800, original_price:3800, image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'New',     description:'Premium leather handbag for everyday elegance.' },
    { name:'Stud Earrings',           price:350,  original_price:500,  image:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Sale',    description:'Classic gold stud earrings for a refined look.' },
    { name:'Crossbody Bag',           price:1600, original_price:2200, image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=687&auto=format&fit=crop',   category:'Accessories', tag:'accessories', badge:'Hot',     description:'Compact crossbody bag perfect for on-the-go.' },
  ]);
  console.log('✅ 65 Products seeded');
}

module.exports = { connectDB, seedProducts, User, Product, Cart, Wishlist, Order, Contact };
