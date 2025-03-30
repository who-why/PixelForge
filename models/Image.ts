import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['generated', 'faceswap', 'bgremoval'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema); 