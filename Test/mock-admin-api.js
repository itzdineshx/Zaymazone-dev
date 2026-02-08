import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Simple admin authentication
const ADMIN_CREDENTIALS = {
  email: 'admin@zaymazone.com',
  password: 'admin123'
}

// Admin login endpoint
app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body
  
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    // Generate a simple token (in production, use proper JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    
    res.json({
      success: true,
      token,
      user: {
        id: 'admin-001',
        email: ADMIN_CREDENTIALS.email,
        name: 'Administrator',
        role: 'admin'
      }
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }
})

// Simple auth middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const token = authHeader.substring(7)
  
  try {
    // Simple token validation (in production, use proper JWT verification)
    const decoded = Buffer.from(token, 'base64').toString('ascii')
    if (decoded.includes(ADMIN_CREDENTIALS.email)) {
      req.user = { email: ADMIN_CREDENTIALS.email, role: 'admin' }
      next()
    } else {
      res.status(401).json({ error: 'Invalid token' })
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Mock admin stats
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  res.json({
    stats: {
      totalProducts: 1247,
      activeArtisans: 156,
      todayOrders: 23,
      totalUsers: 5432,
      totalRevenue: 1250000,
      averageOrderValue: 2778,
      pendingApprovals: {
        products: 5,
        artisans: 3
      }
    },
    monthlyStats: [
      { month: 'Jan', revenue: 95000, orders: 34 },
      { month: 'Feb', revenue: 112000, orders: 42 },
      { month: 'Mar', revenue: 128000, orders: 48 },
      { month: 'Apr', revenue: 145000, orders: 52 }
    ]
  })
})

// Mock pending products
app.get('/api/admin/approvals/products', authenticateAdmin, (req, res) => {
  res.json({
    products: [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'Handcrafted Wooden Bowl',
        artisan: { name: 'Rajesh Kumar', _id: '507f1f77bcf86cd799439012' },
        category: 'Wood Crafts',
        price: 2500,
        description: 'Beautiful handcrafted wooden bowl made from sustainable oak wood.',
        images: ['/api/placeholder/100/100'],
        createdAt: '2024-01-15T10:30:00Z',
        status: 'pending'
      },
      {
        _id: '507f1f77bcf86cd799439013',
        name: 'Blue Pottery Vase',
        artisan: { name: 'Priya Sharma', _id: '507f1f77bcf86cd799439014' },
        category: 'Pottery',
        price: 1800,
        description: 'Traditional blue pottery vase with intricate designs.',
        images: ['/api/placeholder/100/100'],
        createdAt: '2024-01-14T16:45:00Z',
        status: 'pending'
      }
    ]
  })
})

// Mock pending artisans
app.get('/api/admin/approvals/artisans', authenticateAdmin, (req, res) => {
  res.json({
    artisans: [
      {
        _id: '507f1f77bcf86cd799439015',
        name: 'Amit Patel',
        email: 'amit.patel@email.com',
        phone: '+91 9876543210',
        location: 'Jaipur, Rajasthan',
        specialization: 'Metal Crafts',
        experience: '8 years',
        bio: 'Experienced metal craftsman specializing in traditional Rajasthani techniques.',
        createdAt: '2024-01-13T11:20:00Z',
        status: 'pending'
      },
      {
        _id: '507f1f77bcf86cd799439016',
        name: 'Sunita Devi',
        email: 'sunita.devi@email.com',
        phone: '+91 9876543211',
        location: 'Varanasi, Uttar Pradesh',
        specialization: 'Textile Weaving',
        experience: '12 years',
        bio: 'Master weaver with expertise in traditional Banarasi textiles.',
        createdAt: '2024-01-12T14:30:00Z',
        status: 'pending'
      }
    ]
  })
})

// Mock pending users
app.get('/api/admin/approvals/users', authenticateAdmin, (req, res) => {
  res.json({
    users: [
      {
        _id: '507f1f77bcf86cd799439017',
        name: 'Rahul Singh',
        email: 'rahul.singh@email.com',
        phone: '+91 9876543212',
        emailVerified: true,
        createdAt: '2024-01-10T09:15:00Z',
        status: 'pending'
      }
    ]
  })
})

// Approval endpoints
app.post('/api/admin/approvals/products/:id/approve', authenticateAdmin, (req, res) => {
  res.json({ message: 'Product approved successfully' })
})

app.post('/api/admin/approvals/products/:id/reject', authenticateAdmin, (req, res) => {
  res.json({ message: 'Product rejected successfully' })
})

app.post('/api/admin/approvals/artisans/:id/approve', authenticateAdmin, (req, res) => {
  res.json({ message: 'Artisan approved successfully' })
})

app.post('/api/admin/approvals/artisans/:id/reject', authenticateAdmin, (req, res) => {
  res.json({ message: 'Artisan rejected successfully' })
})

// Users management
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  const { page = 1, limit = 10 } = req.query
  res.json({
    users: [
      {
        _id: '507f1f77bcf86cd799439018',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '507f1f77bcf86cd799439019',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-02T00:00:00Z'
      }
    ],
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: 100,
      pages: 10
    }
  })
})

app.put('/api/admin/users/:id/status', (req, res) => {
  res.json({ message: 'User status updated successfully' })
})

app.put('/api/admin/users/:id/role', (req, res) => {
  res.json({ message: 'User role updated successfully' })
})

// Orders management
app.get('/api/admin/orders', authenticateAdmin, (req, res) => {
  res.json({
    orders: [
      {
        _id: '507f1f77bcf86cd799439020',
        orderNumber: 'ORD-2024-001',
        user: { name: 'Rahul Singh', email: 'rahul@example.com' },
        totalAmount: 2500,
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        items: [
          {
            product: { name: 'Wooden Bowl', price: 2500 },
            quantity: 1,
            price: 2500
          }
        ]
      }
    ],
    pagination: { page: 1, limit: 10, total: 50, pages: 5 }
  })
})

// Analytics
app.get('/api/admin/analytics/sales', authenticateAdmin, (req, res) => {
  res.json({
    salesData: [
      { date: '2024-01-01', revenue: 15000, orders: 5 },
      { date: '2024-01-02', revenue: 22000, orders: 8 },
      { date: '2024-01-03', revenue: 18000, orders: 6 }
    ],
    topProducts: [
      { name: 'Blue Pottery Tea Set', sales: 45, revenue: 135000 },
      { name: 'Kashmiri Shawl', sales: 38, revenue: 95000 }
    ],
    categoryData: [
      { name: 'Pottery', value: 35 },
      { name: 'Textiles', value: 28 }
    ]
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock API server is running' })
})

// Test route for debugging
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' })
})

app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`)
  console.log(`📊 Admin API endpoints available at http://localhost:${PORT}/api/admin/*`)
  console.log(`🔐 Login endpoint available at http://localhost:${PORT}/api/auth/admin/login`)
})