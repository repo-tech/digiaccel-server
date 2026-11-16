import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map((origin) => origin.trim()).filter(Boolean);
allowedOrigins.push('http://localhost:5173');
app.use(cors({ origin(origin, callback) {
  if (!origin || !process.env.CLIENT_URL || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin is not allowed by CORS'));
} }));
app.options('*', cors());
app.use(express.json());
app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
