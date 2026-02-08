import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
	productId: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Product', 
		required: true 
	},
	quantity: { 
		type: Number, 
		required: true, 
		min: 1,
		max: 50 // Increased max quantity
	},
	price: { 
		type: Number, 
		required: true,
		min: 0 
	}, // Store price at time of adding to cart
	addedAt: { 
		type: Date, 
		default: Date.now 
	}
}, { _id: false })

const cartSchema = new mongoose.Schema({
	userId: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User', 
		required: true,
		unique: true, // One cart per user - creates unique index automatically
		index: true // Remove separate index declaration below
	},
	items: [cartItemSchema],
	totalItems: { 
		type: Number, 
		default: 0 
	},
	totalAmount: { 
		type: Number, 
		default: 0 
	},
	lastUpdated: { 
		type: Date, 
		default: Date.now 
	}
}, { timestamps: true })

// Calculate totals before saving
cartSchema.pre('save', function(next) {
	this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
	this.totalAmount = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
	this.lastUpdated = new Date()
	next()
})

// Additional indexes for performance (userId index is already created by unique: true)
cartSchema.index({ 'items.productId': 1 })

export default mongoose.model('Cart', cartSchema)