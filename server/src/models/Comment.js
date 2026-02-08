import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BlogPost',
		required: true,
		index: true
	},
	
	// Author details
	author: {
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true },
		avatar: { type: String, default: '' },
		website: { type: String, default: '' }
	},
	
	// Comment content
	content: {
		type: String,
		required: true,
		trim: true,
		maxLength: 2000
	},
	
	// Parent comment for replies
	parentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		default: null,
		index: true
	},
	
	// Moderation
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected', 'spam'],
		default: 'pending',
		index: true
	},
	
	// Engagement
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	reports: { type: Number, default: 0 },
	
	// Metadata
	ipAddress: { type: String, default: '' },
	userAgent: { type: String, default: '' },
	
	// Admin actions
	moderatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null
	},
	moderatedAt: { type: Date, default: null },
	moderationReason: { type: String, default: '' },
	
	// Timestamps
	createdAt: { type: Date, default: Date.now, index: true },
	updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
commentSchema.pre('save', function(next) {
	this.updatedAt = new Date();
	next();
});

// Virtual for reply count
commentSchema.virtual('replyCount', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'parentId',
	count: true
});

// Virtual for nested replies
commentSchema.virtual('replies', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'parentId',
	options: { sort: { createdAt: 1 } }
});

// Ensure virtual fields are serialized
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

// Indexes for performance
commentSchema.index({ postId: 1, status: 1, createdAt: -1 });
commentSchema.index({ 'author.email': 1 });
commentSchema.index({ status: 1, createdAt: -1 });

// Static methods
commentSchema.statics.getCommentsByPost = function(postId, options = {}) {
	const {
		status = 'approved',
		limit = 50,
		skip = 0,
		includeReplies = true
	} = options;
	
	const query = { postId, status };
	if (!includeReplies) {
		query.parentId = null;
	}
	
	return this.find(query)
		.populate('replies')
		.sort({ createdAt: -1 })
		.limit(limit)
		.skip(skip);
};

commentSchema.statics.getCommentsForModeration = function(options = {}) {
	const {
		status = 'pending',
		limit = 100,
		skip = 0
	} = options;
	
	return this.find({ status })
		.populate('postId', 'title slug')
		.sort({ createdAt: -1 })
		.limit(limit)
		.skip(skip);
};

// Instance methods
commentSchema.methods.approve = function(moderatorId, reason = '') {
	this.status = 'approved';
	this.moderatedBy = moderatorId;
	this.moderatedAt = new Date();
	this.moderationReason = reason;
	return this.save();
};

commentSchema.methods.reject = function(moderatorId, reason = '') {
	this.status = 'rejected';
	this.moderatedBy = moderatorId;
	this.moderatedAt = new Date();
	this.moderationReason = reason;
	return this.save();
};

commentSchema.methods.markAsSpam = function(moderatorId, reason = '') {
	this.status = 'spam';
	this.moderatedBy = moderatorId;
	this.moderatedAt = new Date();
	this.moderationReason = reason;
	return this.save();
};

export default mongoose.model('Comment', commentSchema);