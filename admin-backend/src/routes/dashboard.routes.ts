import express from 'express';
import * as DashboardController from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/stats', DashboardController.getStats);

export default router;
