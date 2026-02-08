import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	name: {
		type: String,
		required: true,
		trim: true,
		maxLength: 100
	},
	phone: {
		type: String,
		required: true,
		trim: true,
		maxLength: 15
	},
	street: {
		type: String,
		required: true,
		trim: true,
		maxLength: 255
	},
	city: {
		type: String,
		required: true,
		trim: true,
		maxLength: 100
	},
	state: {
		type: String,
		required: true,
		trim: true,
		maxLength: 100
	},
	zipCode: {
		type: String,
		required: true,
		trim: true,
		maxLength: 20
	},
	country: {
		type: String,
		required: true,
		default: 'India',
		maxLength: 100
	},
	type: {
		type: String,
		enum: ['home', 'work', 'other'],
		default: 'home'
	},
	isDefault: {
		type: Boolean,
		default: false
	}
}, { timestamps: true })

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
	if (this.isDefault) {
		// Remove default flag from other addresses for this user
		await mongoose.model('Address').updateMany(
			{ userId: this.userId, _id: { $ne: this._id } },
			{ isDefault: false }
		)
	}
	next()
})

// Indexes for performance
addressSchema.index({ userId: 1, isDefault: 1 })
addressSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('Address', addressSchema)