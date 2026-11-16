import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import { seed } from './seed/seed.js';
import Task from './models/Task.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ success: true }));
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDb()
  .then(async () => {
    const count = await Task.countDocuments();
    if (count === 0) {
      await seed();
      console.log('Seeded initial tasks');
    }
    app.listen(port, () => console.log(`API listening on ${port}`));
  })
  .catch((error) => {
    console.error('Unable to start API:', error.message);
    process.exit(1);
  });
