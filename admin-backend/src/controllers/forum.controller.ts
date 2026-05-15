import { Request, Response } from 'express';
import * as ForumService from '../services/forum.service';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await ForumService.fetchAllPosts();
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleVisibility = async (req: Request, res: Response) => {
  try {
    const result = await ForumService.updateVisibility(req.params.id as string);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
