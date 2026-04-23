import { Request, Response } from 'express';
import * as QuestionService from '../services/question.service';

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await QuestionService.fetchAllQuestions();
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const newQuestion = await QuestionService.createNewQuestion(req.body);
    res.status(201).json(newQuestion);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    await QuestionService.deleteQuestionById(req.params.id as string);
    res.json({ message: 'Question deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const updated = await QuestionService.updateQuestionById(req.params.id as string, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
