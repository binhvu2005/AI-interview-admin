import express from 'express';
import * as QuestionController from '../controllers/question.controller';

const router = express.Router();

router.get('/', QuestionController.getAllQuestions);
router.post('/', QuestionController.createQuestion);
router.put('/:id', QuestionController.updateQuestion);
router.delete('/:id', QuestionController.deleteQuestion);

export default router;
