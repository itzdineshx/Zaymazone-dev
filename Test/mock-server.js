import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let users = [];
let products = [];
let orders = [];
let carts = {};

// Auth routes
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  const user = { id: Date.now().toString(), name, email, role: 'user' };
  users.push(user);
  res.json({ user, token: 'mock-token-' + user.id });
});

app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email) || {
    id: '1',
    name: 'Test User',
    email: email,
    role: 'user'
  };
  res.json({ user, token: 'mock-token-' + user.id });
});

// Products routes
app.get('/api/products', (req, res) => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Handwoven Kashmiri Shawl',
      price: 4500,
      images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop'],
      description: 'Beautiful handwoven Kashmiri shawl',
      category: 'textiles',
      artisan: { name: 'Meera Devi', location: 'Kashmir' }
    },
    {
      _id: '2',
      name: 'Blue Pottery Tea Set',
      price: 2200,
      images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop'],
      description: 'Traditional blue pottery tea set',
      category: 'pottery',
      artisan: { name: 'Rajesh Kumar', location: 'Jaipur' }
    }
  ];
  res.json(mockProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = {
    _id: req.params.id,
    name: 'Handwoven Kashmiri Shawl',
    price: 4500,
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop'],
    description: 'Beautiful handwoven Kashmiri shawl made by skilled artisans',
    category: 'textiles',
    artisan: { name: 'Meera Devi', location: 'Kashmir' },
    inStock: true,
    stockCount: 5
  };
  res.json(product);
});

// Cart routes
app.get('/api/cart', (req, res) => {
  const userId = req.headers.authorization?.split(' ')[1] || 'guest';
  const cart = carts[userId] || { items: [], total: 0, itemCount: 0, updatedAt: new Date() };
  res.json(cart);
});

app.post('/api/cart/add', (req, res) => {
  const userId = req.headers.authorization?.split(' ')[1] || 'guest';
  const { productId, quantity = 1 } = req.body;
  
  if (!carts[userId]) {
    carts[userId] = { items: [], total: 0, itemCount: 0, updatedAt: new Date() };
  }
  
  const product = {
    id: productId,
    name: 'Sample Product',
    price: 1000,
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop']
  };
  
  const existingItem = carts[userId].items.find(item => item.productId.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].items.push({ productId: product, quantity, addedAt: new Date() });
  }
  
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
  carts[userId].itemCount = carts[userId].items.reduce((sum, item) => sum + item.quantity, 0);
  carts[userId].updatedAt = new Date();
  
  res.json(carts[userId]);
});

app.delete('/api/cart', (req, res) => {
  const userId = req.headers.authorization?.split(' ')[1] || 'guest';
  carts[userId] = { items: [], total: 0, itemCount: 0, updatedAt: new Date() };
  res.json({ message: 'Cart cleared' });
});

// Orders routes
app.get('/api/orders', (req, res) => {
  res.json([]);
});

app.post('/api/orders', (req, res) => {
  const order = {
    _id: 'ORDER-' + Date.now(),
    ...req.body,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  orders.push(order);
  res.json(order);
});

// Artisan routes
app.get('/api/artisans/:id', (req, res) => {
  const artisan = {
    id: req.params.id,
    name: 'Meera Devi',
    avatar: '/src/assets/artisan-avatar-1.jpg',
    location: { city: 'Srinagar', state: 'Kashmir', country: 'India' },
    specialization: ['Kashmiri Shawls', 'Pashmina', 'Traditional Weaving'],
    rating: 4.8,
    totalReviews: 156,
    totalProducts: 42,
    isVerified: true,
    yearsOfExperience: 25
  };
  res.json(artisan);
});

// Wishlist routes
app.get('/api/wishlist', (req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});

export default app;