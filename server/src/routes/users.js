import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Cart from '../models/Cart.js'
import { requireAuth, requireActiveUser } from '../middleware/auth.js'

const router = Router()

// Validation schemas
const updateProfileSchema = z.object({
	name: z.string().min(1).max(120).optional(),
	phone: z.string().optional(),
	avatar: z.string().url().optional(),
	address: z.object({
		street: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		zipCode: z.string().optional(),
		country: z.string().optional()
	}).optional(),
	preferences: z.object({
		newsletter: z.boolean().optional(),
		notifications: z.boolean().optional(),
		language: z.string().optional()
	}).optional()
})

const changePasswordSchema = z.object({
	currentPassword: z.string().min(6),
	newPassword: z.string().min(8).max(128)
})

// Get user profile
router.get('/profile', requireAuth, requireActiveUser, async (req, res) => {
	try {
		const user = await User.findById(req.user.sub)
			.select('-passwordHash -refreshTokens -emailVerificationToken -passwordResetToken -passwordResetExpires')
		
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}
		
		return res.json({ user })
	} catch (error) {
		console.error('Get profile error:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
})

// Update user profile
router.patch('/profile', requireAuth, requireActiveUser, async (req, res) => {
	try {
		const parsed = updateProfileSchema.safeParse(req.body)
		if (!parsed.success) {
			return res.status(400).json({ error: parsed.error.errors[0]?.message })
		}
		
		const updateData = parsed.data
		const userId = req.user.sub
		
		const user = await User.findByIdAndUpdate(
			userId, 
			{ $set: updateData },
			{ new: true, runValidators: true }
		).select('-passwordHash -refreshTokens -emailVerificationToken -passwordResetToken -passwordResetExpires')
		
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}
		
		return res.json({ user })
	} catch (error) {
		console.error('Update profile error:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
})

// Change password
router.patch('/change-password', requireAuth, requireActiveUser, async (req, res) => {
	try {
		const parsed = changePasswordSchema.safeParse(req.body)
		if (!parsed.success) {
			return res.status(400).json({ error: parsed.error.errors[0]?.message })
		}
		
		const { currentPassword, newPassword } = parsed.data
		const userId = req.user.sub
		
		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}
		
		// Verify current password
		const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
		if (!isCurrentPasswordValid) {
			return res.status(400).json({ error: 'Current password is incorrect' })
		}
		
		// Hash new password
		const newPasswordHash = await bcrypt.hash(newPassword, 10)
		
		// Update password and clear all refresh tokens (force re-login on all devices)
		await User.findByIdAndUpdate(userId, {
			$set: { passwordHash: newPasswordHash },
			$unset: { refreshTokens: 1 }
		})
		
		return res.json({ message: 'Password changed successfully. Please login again.' })
	} catch (error) {
		console.error('Change password error:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
})

// Delete user account (soft delete)
router.delete('/account', requireAuth, requireActiveUser, async (req, res) => {
	try {
		const userId = req.user.sub
		
		// Soft delete user account
		await User.findByIdAndUpdate(userId, {
			$set: { isActive: false },
			$unset: { refreshTokens: 1 }
		})
		
		// Optionally, clear the user's cart
		await Cart.findOneAndDelete({ userId })
		
		return res.json({ message: 'Account deactivated successfully' })
	} catch (error) {
		console.error('Delete account error:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
})

// Get user dashboard stats
router.get('/dashboard', requireAuth, requireActiveUser, async (req, res) => {
	try {
		const userId = req.user.sub
		
		// Get cart summary
		const cart = await Cart.findOne({ userId })
		const cartSummary = cart ? {
			totalItems: cart.totalItems,
			totalAmount: cart.totalAmount
		} : { totalItems: 0, totalAmount: 0 }
		
		// TODO: Add order history when Order model is implemented
		// const orderCount = await Order.countDocuments({ userId, status: { $ne: 'cancelled' } })
		// const totalSpent = await Order.aggregate([...])
		
		return res.json({
			cart: cartSummary,
			// orders: { count: orderCount, totalSpent },
			// TODO: Add wishlist count, recent activity, etc.
		})
	} catch (error) {
		console.error('Dashboard error:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
})

export default router