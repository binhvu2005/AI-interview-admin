import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: String, required: true },
  level: { type: String, required: true },
  matchScore: { type: Number },
  matchAnalysis: { type: String },
  
  messages: [{
    role: { type: String, enum: ['ai', 'user'] },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],

  evaluation: {
    totalScore: { type: Number },
    summary: { type: String },
    pros: [{ type: String }],
    cons: [{ type: String }],
    improvements: [{ type: String }],
    detailedFeedback: [{
      question: { type: String },
      answer: { type: String },
      score: { type: Number },
      status: { type: String },
      correctReview: { type: String },
      feedback: { type: String }
    }]
  },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Interview', interviewSchema);
