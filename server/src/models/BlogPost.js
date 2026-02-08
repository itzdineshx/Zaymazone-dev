import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true, maxLength: 200 },
	slug: { type: String, required: true, unique: true, lowercase: true, index: true },
	excerpt: { type: String, required: true, maxLength: 500 },
	content: { type: String, required: true },
	featuredImage: { type: String, required: true },
	images: [{ type: String }],
	author: {
		name: { type: String, required: true },
		bio: { type: String, default: '' },
		avatar: { type: String, default: '' },
		role: { type: String, default: 'Writer' }
	},
	category: { 
		type: String, 
		required: true,
		enum: ['Traditional Crafts', 'Textiles', 'Metal Crafts', 'Pottery', 'Sustainability', 'Community Impact', 'Innovation', 'Business'],
		index: true 
	},
	tags: [{ type: String, trim: true, lowercase: true }],
	status: {
		type: String,
		enum: ['draft', 'published', 'archived'],
		default: 'draft',
		index: true
	},
	featured: { type: Boolean, default: false, index: true },
	readTime: { type: String, default: '5 min read' },
	seoTitle: { type: String, trim: true, maxLength: 60 },
	seoDescription: { type: String, trim: true, maxLength: 160 },
	publishedAt: { type: Date },
	// Analytics
	views: { type: Number, default: 0 },
	likes: { type: Number, default: 0 },
	comments: { type: Number, default: 0 },
	shares: { type: Number, default: 0 },
	// Admin fields
	authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	isActive: { type: Boolean, default: true },
	// Approval workflow fields
	approvalStatus: { 
		type: String, 
		enum: ['pending', 'approved', 'rejected'], 
		default: 'pending',
		index: true
	},
	approvalNotes: { type: String, trim: true },
	rejectionReason: { type: String, trim: true },
	approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	approvedAt: { type: Date },
}, { timestamps: true })

// Indexes for performance
blogPostSchema.index({ status: 1, publishedAt: -1 })
blogPostSchema.index({ category: 1, status: 1 })
blogPostSchema.index({ featured: -1, status: 1 })
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' })
blogPostSchema.index({ publishedAt: -1 })

// Virtual for URL
blogPostSchema.virtual('url').get(function() {
	return `/blog/${this.slug}`
})

// Pre-save middleware to generate slug and set publishedAt
blogPostSchema.pre('save', function(next) {
	if (!this.slug) {
		this.slug = this.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
	}
	
	if (this.status === 'published' && !this.publishedAt) {
		this.publishedAt = new Date()
	}
	
	next()
})

export default mongoose.model('BlogPost', blogPostSchema)