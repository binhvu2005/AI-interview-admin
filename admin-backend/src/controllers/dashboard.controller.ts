import { Request, Response } from 'express';
import User from '../models/user.model';
import Question from '../models/question.model';
import Interview from '../models/interview.model';

export const getStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalQuestions, totalInterviews, interviews] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Interview.countDocuments(),
      Interview.find().select('evaluation.totalScore')
    ]);

    const validScores = (interviews as any[])
      .map(i => i.evaluation?.totalScore)
      .filter(s => s !== undefined && s !== null) as number[];
    
    const avgScore = validScores.length > 0 
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) 
      : 0;

    res.json({
      totalUsers,
      totalQuestions,
      totalInterviews,
      avgScore
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
