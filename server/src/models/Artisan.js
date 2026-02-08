import mongoose from 'mongoose'

const artisanSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
	name: { type: String, required: true, trim: true, maxLength: 120 },
	email: { type: String, required: true, trim: true, lowercase: true, unique: true },
	password: { type: String, required: true },
	bio: { type: String, default: '', maxLength: 1000 },
	location: { 
		city: { type: String, required: true, index: true },
		state: { type: String, required: true },
		country: { type: String, default: 'India' }
	},
	avatar: { type: String, default: '' },
	coverImage: { type: String, default: '' },
	specialties: [{ type: String, trim: true }], // e.g., ['pottery', 'textiles']
	experience: { type: Number, min: 0 }, // years of experience
	socials: {
		instagram: { type: String, trim: true },
		facebook: { type: String, trim: true },
		website: { type: String, trim: true }
	},
	verification: {
		isVerified: { type: Boolean, default: false },
		documentType: { type: String, enum: ['aadhar', 'pan', 'license'] },
		documentNumber: { type: String, trim: true },
		bankDetails: {
			accountNumber: { type: String, trim: true },
			ifscCode: { type: String, trim: true },
			bankName: { type: String, trim: true }
		},
		verifiedAt: { type: Date }
	},
	// Seller onboarding specific fields
	businessInfo: {
		businessName: { type: String, trim: true },
		sellerType: { type: String, enum: ['gst', 'non-gst'] },
		gstNumber: { type: String, trim: true },
		panNumber: { type: String, trim: true },
		contact: {
			email: { type: String, trim: true },
			phone: { type: String, trim: true },
			address: {
				village: { type: String, trim: true },
				district: { type: String, trim: true },
				state: { type: String, trim: true },
				pincode: { type: String, trim: true }
			}
		}
	},
	productInfo: {
		description: { type: String, maxLength: 1000 },
		materials: { type: String, maxLength: 500 },
		priceRange: {
			min: { type: Number, min: 0 },
			max: { type: Number, min: 0 }
		},
		stockQuantity: { type: Number, min: 0 },
		photos: [{ type: String }] // Array of photo URLs
	},
	logistics: {
		pickupAddress: {
			sameAsMain: { type: Boolean, default: true },
			address: { type: String, trim: true }
		},
		dispatchTime: { type: String, trim: true },
		packagingType: { type: String, trim: true }
	},
	documents: {
		gstCertificate: { type: String, trim: true },
		aadhaarProof: { type: String, trim: true },
		craftVideo: { type: String, trim: true }
	},
	payment: {
		upiId: { type: String, trim: true },
		paymentFrequency: { type: String, trim: true }
	},
	rating: { type: Number, min: 0, max: 5, default: 0 },
	totalRatings: { type: Number, default: 0 },
	totalProducts: { type: Number, default: 0 },
	totalSales: { type: Number, default: 0 },
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
	// Document verification tracking
	documentVerification: {
		profilePhoto: { type: Boolean, default: false },
		gstCertificate: { type: Boolean, default: false },
		aadhaarProof: { type: Boolean, default: false },
		craftVideo: { type: Boolean, default: false },
		productPhotos: { type: Boolean, default: false },
		bankDetails: { type: Boolean, default: false }
	},
	// Track changes made by artisan after approval (for admin notification only)
	pendingChanges: {
		hasChanges: { type: Boolean, default: false },
		changedAt: { type: Date },
		changedFields: [{ type: String }], // Array of field names that were changed
		changes: { type: mongoose.Schema.Types.Mixed } // Store the new values for reference
	},
	joinedDate: { type: Date, default: Date.now }
}, { timestamps: true })

// Indexes
artisanSchema.index({ 'location.city': 1, isActive: 1 })
artisanSchema.index({ specialties: 1 })
artisanSchema.index({ rating: -1 })
// userId already has unique index, no need for additional index

export default mongoose.model('Artisan', artisanSchema)


