import express from 'express';
import * as UserController from '../controllers/user.controller';

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserDetail);
router.put('/:id/toggle-lock', UserController.toggleLock);

export default router;
