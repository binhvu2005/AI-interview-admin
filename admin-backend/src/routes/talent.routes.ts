import express from 'express';
import * as TalentController from '../controllers/talent.controller';

const router = express.Router();

router.get('/', TalentController.getTalentPool);

export default router;
