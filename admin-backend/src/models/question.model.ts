import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  content: string;
  role: string;
  seniority: string;
  skills: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

const QuestionSchema: Schema = new Schema({
  content: { type: String, required: true },
  role: { type: String, required: true },
  seniority: { type: String, required: true },
  skills: [{ type: String }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
export default Question;
