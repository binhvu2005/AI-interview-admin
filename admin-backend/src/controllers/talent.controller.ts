import { Request, Response } from 'express';
import Interview from '../models/interview.model';
import User from '../models/user.model';

export const getTalentPool = async (req: Request, res: Response) => {
  try {
    // Aggregate interviews to find best performance per user
    const talentData = await Interview.aggregate([
      { $sort: { createdAt: 1 } }, // Sort to ensure $last gets the latest
      {
        $group: {
          _id: '$userId',
          maxScore: { $max: '$evaluation.totalScore' },
          maxMatch: { $max: '$matchScore' },
          interviewCount: { $sum: 1 },
          lastPosition: { $last: '$position' },
          lastLevel: { $last: '$level' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          name: '$userDetails.fullName',
          avatar: '$userDetails.avatar',
          role: '$lastPosition',
          score: '$maxScore',
          atsMatch: '$maxMatch',
          interviews: '$interviewCount',
          location: { $literal: 'Remote / Global' } // Placeholder since we don't store location yet
        }
      },
      { $sort: { score: -1 } }
    ]);

    // Add rank and badge logic
    const ranked = talentData.map((c, i) => {
      const rankVal = i + 1;
      const total = talentData.length;
      const percentile = ((total - i) / total) * 100;
      
      let badge = 'Top 50%';
      if (percentile >= 99) badge = 'Top 1%';
      else if (percentile >= 95) badge = 'Top 5%';
      else if (percentile >= 90) badge = 'Top 10%';
      else if (percentile >= 80) badge = 'Top 20%';

      return {
        ...c,
        rank: `#${rankVal}`,
        badge
      };
    });

    res.json(ranked);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
