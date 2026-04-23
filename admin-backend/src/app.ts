import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import questionRoutes from './routes/question.routes';
import metadataRoutes from './routes/metadata.routes';
import dashboardRoutes from './routes/dashboard.routes';
import talentRoutes from './routes/talent.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/questions', questionRoutes);
app.use('/api/admin/metadata', metadataRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/talent', talentRoutes);

export default app;
