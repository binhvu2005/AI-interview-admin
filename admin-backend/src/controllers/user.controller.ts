import { Request, Response } from 'express';
import * as UserService from '../services/user.service';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersWithStats = await UserService.fetchAllUsersWithStats();
    res.json(usersWithStats);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserDetail = async (req: Request, res: Response) => {
  try {
    const data = await UserService.fetchUserDetailWithInterviews(req.params.id as string);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLock = async (req: Request, res: Response) => {
  try {
    const result = await UserService.updateLockStatus(req.params.id as string);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
