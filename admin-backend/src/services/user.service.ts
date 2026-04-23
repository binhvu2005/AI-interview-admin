import User from '../models/user.model';
import Interview from '../models/interview.model';

export const fetchAllUsersWithStats = async () => {
  const users = await User.find().select('-password');
  return await Promise.all(users.map(async (u: any) => {
    const count = await Interview.countDocuments({ userId: u._id });
    return { ...u._doc, interviewCount: count };
  }));
};

export const fetchUserDetailWithInterviews = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
  return { user, interviews };
};

export const updateLockStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  user.isLocked = !user.isLocked;
  await user.save();
  
  return { message: `User ${user.isLocked ? 'locked' : 'unlocked'}`, isLocked: user.isLocked };
};
