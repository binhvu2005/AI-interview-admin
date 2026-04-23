import { Question } from '../models/question.model';

export const fetchAllQuestions = async () => {
  return await Question.find().sort({ createdAt: -1 });
};

export const createNewQuestion = async (questionData: any) => {
  const question = new Question(questionData);
  return await question.save();
};

export const deleteQuestionById = async (id: string) => {
  return await Question.findByIdAndDelete(id);
};

export const updateQuestionById = async (id: string, data: any) => {
  return await Question.findByIdAndUpdate(id, data, { new: true });
};
