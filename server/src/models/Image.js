import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  gridfsId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { 
    type: String, 
    enum: ['product', 'artisan', 'blog', 'other'], 
    default: 'other' 
  },
  uploadDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Indexes
imageSchema.index({ filename: 1 })
imageSchema.index({ category: 1 })
imageSchema.index({ gridfsId: 1 })

export default mongoose.model('Image', imageSchema)