import mongoose from 'mongoose';

const metadataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['position', 'level'], required: true },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Metadata', metadataSchema);
