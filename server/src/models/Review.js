import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
	orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
	rating: { type: Number, required: true, min: 1, max: 5 },
	title: { type: String, trim: true, maxLength: 100 },
	comment: { type: String, trim: true, maxLength: 1000 },
	images: [{ type: String }], // Review images uploaded by user
	isVerified: { type: Boolean, default: false }, // Verified purchase
	helpfulCount: { type: Number, default: 0 },
	isApproved: { type: Boolean, default: true }, // For moderation
	response: {
		message: { type: String, maxLength: 500 },
		respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		respondedAt: { type: Date }
	}
}, { timestamps: true })

// Compound index to ensure one review per user per product per order
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true })
reviewSchema.index({ productId: 1, isApproved: 1, createdAt: -1 })
reviewSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('Review', reviewSchema)