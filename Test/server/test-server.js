import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = 4001;

// Basic middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/zaymazone')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// Blog routes - import the blog model
import BlogPost from './src/models/BlogPost.js';

app.get('/api/blog/featured', async (req, res) => {
  try {
    const posts = await BlogPost.find({ featured: true, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(10);
    res.json(posts);
  } catch (error) {
    console.error('Featured posts error:', error);
    res.status(500).json({ error: 'Failed to fetch featured posts' });
  }
});

app.get('/api/blog/categories', async (req, res) => {
  try {
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/blog', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { status: 'published' };
    
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Blog posts error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Artisans route
import Artisan from './src/models/Artisan.js';

app.get('/api/artisans', async (req, res) => {
  try {
    const artisans = await Artisan.find({ isActive: true }).sort({ rating: -1 });
    res.json(artisans);
  } catch (error) {
    console.error('Artisans error:', error);
    res.status(500).json({ error: 'Failed to fetch artisans' });
  }
});

// Error handling
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
});