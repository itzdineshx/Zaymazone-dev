import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Simple test route
app.get('/test', (req, res) => {
  console.log('Test route hit')
  res.json({ message: 'Test route working' })
})

// Admin login endpoint
app.post('/api/auth/admin/login', (req, res) => {
  console.log('Login route hit with body:', req.body)
  const { email, password } = req.body
  
  if (email === 'admin@zaymazone.com' && password === 'admin123') {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    
    res.json({
      success: true,
      token,
      user: {
        id: 'admin-001',
        email: 'admin@zaymazone.com',
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

app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on http://localhost:${PORT}`)
  console.log(`🔐 Login endpoint: POST http://localhost:${PORT}/api/auth/admin/login`)
})