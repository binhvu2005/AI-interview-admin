import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  replies: [{ type: mongoose.Schema.Types.Mixed }],
  isHidden: { type: Boolean, default: false }
});

export default mongoose.models.ForumPost || mongoose.model('ForumPost', forumPostSchema);
