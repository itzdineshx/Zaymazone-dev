import { Router } from 'express'
import { z } from 'zod'
import Wishlist from '../models/Wishlist.js'
import Product from '../models/Product.js'
import { authenticateToken } from '../middleware/firebase-auth.js'

const router = Router()

// All wishlist routes require authentication
router.use(authenticateToken)

const addItemSchema = z.object({
	productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID')
})

// Get user's wishlist
router.get('/', async (req, res) => {
	try {
		let wishlist = await Wishlist.findOne({ userId: req.user._id })
			.populate({
				path: 'products.productId',
				select: 'name price images category artisanId rating reviewCount isActive'
			})
			.lean()
		
		if (!wishlist) {
			wishlist = { products: [] }
		}
		
		// Filter out inactive products
		wishlist.products = wishlist.products.filter(item => 
			item.productId && item.productId.isActive
		)
		
		return res.json(wishlist)
	} catch (error) {
		console.error('Get wishlist error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

// Add item to wishlist
router.post('/add', async (req, res) => {
	try {
		const parsed = addItemSchema.safeParse(req.body)
		if (!parsed.success) {
			return res.status(400).json({ 
				error: 'Validation failed', 
				details: parsed.error.errors 
			})
		}
		
		const { productId } = parsed.data
		
		// Check if product exists and is active
		const product = await Product.findById(productId).select('isActive')
		if (!product || !product.isActive) {
			return res.status(404).json({ error: 'Product not found' })
		}
		
		// Find or create wishlist
		let wishlist = await Wishlist.findOne({ userId: req.user._id })
		
		if (!wishlist) {
			wishlist = new Wishlist({
				userId: req.user._id,
				products: [{ productId }]
			})
		} else {
			// Check if product already in wishlist
			const existingItem = wishlist.products.find(
				item => item.productId.toString() === productId
			)
			
			if (existingItem) {
				return res.status(409).json({ error: 'Product already in wishlist' })
			}
			
			// Add product to wishlist
			wishlist.products.push({ productId })
		}
		
		await wishlist.save()
		
		// Return the updated wishlist with populated product data
		const populated = await Wishlist.findOne({ userId: req.user._id })
			.populate({
				path: 'products.productId',
				select: 'name price images category artisanId rating reviewCount isActive'
			})
			.lean()
		
		return res.status(201).json(populated)
	} catch (error) {
		console.error('Add to wishlist error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

// Remove item from wishlist
router.delete('/item/:productId', async (req, res) => {
	try {
		const { productId } = req.params
		
		// Validate productId format
		if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
			return res.status(400).json({ error: 'Invalid product ID format' })
		}
		
		const wishlist = await Wishlist.findOne({ userId: req.user._id })
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found' })
		}
		
		// Check if product exists in wishlist
		const itemIndex = wishlist.products.findIndex(
			item => item.productId.toString() === productId
		)
		
		if (itemIndex === -1) {
			return res.status(404).json({ error: 'Product not in wishlist' })
		}
		
		// Remove item from wishlist
		wishlist.products.splice(itemIndex, 1)
		await wishlist.save()
		
		// Return updated wishlist
		const populated = await Wishlist.findOne({ userId: req.user._id })
			.populate({
				path: 'products.productId',
				select: 'name price images category artisanId rating reviewCount isActive'
			})
			.lean()
		
		return res.json(populated)
	} catch (error) {
		console.error('Remove from wishlist error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

// Clear entire wishlist
router.delete('/clear', async (req, res) => {
	try {
		await Wishlist.findOneAndUpdate(
			{ userId: req.user._id },
			{ products: [] },
			{ new: true }
		)
		
		return res.json({ message: 'Wishlist cleared successfully' })
	} catch (error) {
		console.error('Clear wishlist error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

export default router