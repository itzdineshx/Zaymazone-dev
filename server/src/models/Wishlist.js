import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
	products: [{
		productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
		addedAt: { type: Date, default: Date.now }
	}],
	updatedAt: { type: Date, default: Date.now }
})

// Update timestamp on save
wishlistSchema.pre('save', function(next) {
	this.updatedAt = Date.now()
	next()
})

// Index for efficient queries  
// userId already has unique index, no need for additional index
wishlistSchema.index({ 'products.productId': 1 })

export default mongoose.model('Wishlist', wishlistSchema)