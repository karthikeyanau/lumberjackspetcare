import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'toys', 'grooming', 'health', 'accessories', 'treats'],
  },
  subcategory: {
    type: String,
  },
  petType: {
    type: [String],
    enum: ['dog', 'cat', 'bird', 'small-animal', 'all'],
    default: ['all'],
  },
  images: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    default: 0,
  },
  sku: {
    type: String,
    unique: true,
  },
  brand: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  subscriptionEligible: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);

