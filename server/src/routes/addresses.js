import { Router } from 'express'
import { z } from 'zod'
import Address from '../models/Address.js'
import { authenticateToken } from '../middleware/firebase-auth.js'

const router = Router()

// All address routes require authentication
router.use(authenticateToken)

const addressSchema = z.object({
	name: z.string().min(1).max(100),
	phone: z.string().min(1).max(15),
	street: z.string().min(1).max(255),
	city: z.string().min(1).max(100),
	state: z.string().min(1).max(100),
	zipCode: z.string().min(1).max(20),
	country: z.string().min(1).max(100).default('India'),
	type: z.enum(['home', 'work', 'other']).default('home'),
	isDefault: z.boolean().default(false)
})

// Get all user addresses
router.get('/', async (req, res) => {
	try {
		const addresses = await Address.find({ userId: req.user._id })
			.sort({ isDefault: -1, createdAt: -1 })
			.lean()

		return res.json(addresses)
	} catch (error) {
		console.error('Get addresses error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

// Add new address
router.post('/', async (req, res) => {
	try {
		const parsed = addressSchema.safeParse(req.body)
		if (!parsed.success) {
			return res.status(400).json({
				error: 'Validation failed',
				details: parsed.error.errors
			})
		}

		const addressData = parsed.data

		// If this is set as default, unset other defaults first
		if (addressData.isDefault) {
			await Address.updateMany(
				{ userId: req.user._id },
				{ isDefault: false }
			)
		}

		const address = new Address({
			...addressData,
			userId: req.user._id
		})

		await address.save()

		return res.status(201).json({ address })
	} catch (error) {
		console.error('Add address error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

// Update address
router.put('/:id', async (req, res) => {
	try {
		const parsed = addressSchema.safeParse(req.body)
		if (!parsed.success) {
			return res.status(400).json({
				error: 'Validation failed',
				details: parsed.error.errors
			})
		}

		const addressData = parsed.data
		const addressId = req.params.id

		// Find the address and ensure it belongs to the user
		const address = await Address.findOne({ _id: addressId, userId: req.user._id })
		if (!address) {
			return res.status(404).json({ error: 'Address not found' })
		}

		// If this is set as default, unset other defaults first
		if (addressData.isDefault) {
			await Address.updateMany(
				{ userId: req.user._id, _id: { $ne: addressId } },
				{ isDefault: false }
			)
		}

		// Update the address
		Object.assign(address, addressData)
		await address.save()

		return res.json({ address })
	} catch (error) {
		console.error('Update address error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

// Delete address
router.delete('/:id', async (req, res) => {
	try {
		const addressId = req.params.id

		// Find and delete the address
		const address = await Address.findOneAndDelete({
			_id: addressId,
			userId: req.user._id
		})

		if (!address) {
			return res.status(404).json({ error: 'Address not found' })
		}

		return res.json({ message: 'Address deleted successfully' })
	} catch (error) {
		console.error('Delete address error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

// Set address as default
router.put('/:id/default', async (req, res) => {
	try {
		const addressId = req.params.id

		// Find the address and ensure it belongs to the user
		const address = await Address.findOne({ _id: addressId, userId: req.user._id })
		if (!address) {
			return res.status(404).json({ error: 'Address not found' })
		}

		// Unset all other defaults for this user
		await Address.updateMany(
			{ userId: req.user._id },
			{ isDefault: false }
		)

		// Set this address as default
		address.isDefault = true
		await address.save()

		return res.json({ message: 'Address set as default successfully' })
	} catch (error) {
		console.error('Set default address error:', error)
		return res.status(500).json({ error: 'Server error' })
	}
})

export default router