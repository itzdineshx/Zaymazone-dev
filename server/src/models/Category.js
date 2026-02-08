import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
	name: { 
		type: String, 
		required: true, 
		trim: true, 
		maxLength: 100,
		unique: true
	},
	slug: { 
		type: String, 
		required: true, 
		unique: true, 
		lowercase: true, 
		index: true 
	},
	description: { 
		type: String, 
		required: true, 
		maxLength: 500 
	},
	image: { 
		type: String, 
		required: true 
	},
	icon: { 
		type: String, 
		required: true,
		enum: ['Gift', 'ShirtIcon', 'Palette', 'Lightbulb', 'Hammer', 'Brush', 'Scissors', 'Star'],
		default: 'Gift'
	},
	subcategories: [{ 
		type: String, 
		trim: true 
	}],
	featured: { 
		type: Boolean, 
		default: false, 
		index: true 
	},
	displayOrder: { 
		type: Number, 
		default: 0, 
		index: true 
	},
	isActive: { 
		type: Boolean, 
		default: true, 
		index: true 
	},
	// SEO fields
	seoTitle: { 
		type: String, 
		trim: true, 
		maxLength: 60 
	},
	seoDescription: { 
		type: String, 
		trim: true, 
		maxLength: 160 
	},
	// Auto-calculated fields (updated via aggregation or triggers)
	productCount: { 
		type: Number, 
		default: 0 
	},
	artisanCount: { 
		type: Number, 
		default: 0 
	}
}, { timestamps: true })

// Indexes for performance
categorySchema.index({ featured: -1, displayOrder: 1, isActive: 1 })
categorySchema.index({ name: 'text', description: 'text' })
categorySchema.index({ slug: 1, isActive: 1 })

// Virtual for URL
categorySchema.virtual('url').get(function() {
	return `/categories/${this.slug}`
})

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
	if (this.isModified('name') && (!this.slug || this.isNew)) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
	}
	next()
})

// Static method to update product and artisan counts
categorySchema.statics.updateCounts = async function() {
	try {
		// Try to get the models, but don't fail if they're not available
		let Product, Artisan
		try {
			Product = mongoose.model('Product')
		} catch (error) {
			console.warn('Product model not available for count update')
			return
		}
		
		try {
			Artisan = mongoose.model('Artisan')
		} catch (error) {
			console.warn('Artisan model not available for count update')
			// Continue with just product counts if needed
		}
		
		// Get product counts by category
		const productCounts = Product ? await Product.aggregate([
			{ $match: { isActive: true } },
			{ $group: { _id: '$category', count: { $sum: 1 } } }
		]) : []
		
		// Get artisan counts by specialty (which maps to categories)
		const artisanCounts = Artisan ? await Artisan.aggregate([
			{ $match: { isActive: true } },
			{ $unwind: '$specialties' },
			{ $group: { _id: '$specialties', count: { $sum: 1 } } }
		]) : []
		
		// Update each category
		for (const category of await this.find({ isActive: true })) {
			const productData = productCounts.find(p => p._id === category.slug || p._id === category.name.toLowerCase())
			const artisanData = artisanCounts.find(a => a._id === category.slug || a._id === category.name.toLowerCase())
			
			category.productCount = productData ? productData.count : 0
			category.artisanCount = artisanData ? artisanData.count : 0
			
			await category.save()
		}
	} catch (error) {
		console.error('Error updating category counts:', error)
		// Don't throw the error, just log it so the endpoint doesn't fail
	}
}

export default mongoose.model('Category', categorySchema)