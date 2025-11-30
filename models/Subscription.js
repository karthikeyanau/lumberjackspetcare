import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  petProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PetProfile',
  },
  planName: {
    type: String,
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
  }],
  frequency: {
    type: String,
    enum: ['monthly', 'bi-monthly', 'quarterly'],
    default: 'monthly',
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active',
  },
  nextDeliveryDate: {
    type: Date,
  },
  lastDeliveryDate: {
    type: Date,
  },
  customization: {
    preferences: [String],
    exclusions: [String],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

