import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seed } from './seed/seed.js';
import Task from './models/Task.js';

const port = process.env.PORT || 5000;
try {
  await connectDB();
  if (await Task.countDocuments() === 0) await seed();
  app.listen(port, () => console.log(`API listening on ${port}`));
} catch (error) {
  console.error('Unable to start API:', error.message);
  process.exit(1);
}
