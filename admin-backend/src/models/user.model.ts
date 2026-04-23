import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi OverwriteModelError
export default mongoose.models.User || mongoose.model('User', userSchema);
