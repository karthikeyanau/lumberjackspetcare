import mongoose from 'mongoose';

const petProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'small-animal', 'other'],
  },
  breed: {
    type: String,
  },
  age: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  dietaryPreferences: {
    type: [String],
    default: [],
  },
  allergies: {
    type: [String],
    default: [],
  },
  specialNeeds: {
    type: String,
  },
  preferences: {
    favoriteToys: [String],
    favoriteTreats: [String],
    groomingNeeds: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.PetProfile || mongoose.model('PetProfile', petProfileSchema);

