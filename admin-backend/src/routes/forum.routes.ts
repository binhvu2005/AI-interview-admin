import express from 'express';
import * as ForumController from '../controllers/forum.controller';

const router = express.Router();

router.get('/', ForumController.getAllPosts);
router.put('/:id/toggle-visibility', ForumController.toggleVisibility);

export default router;
