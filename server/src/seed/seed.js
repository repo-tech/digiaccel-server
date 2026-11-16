import 'dotenv/config';
import { addDays, startOfWeek } from 'date-fns';
import { connectDb } from '../config/db.js';
import Task from '../models/Task.js';

const today = new Date();
const monday = startOfWeek(today, { weekStartsOn: 1 });
const names = [
  ['Plan sprint', 'Align priorities and scope', -7, '09:00', 'High', 'completed'],
  ['Gym session', 'Strength training', -6, '18:00', 'Medium', 'in-progress'],
  ['Submit proposal', 'Review with design team', -3, '11:00', 'High', 'completed'],
  ['Team standup', '', 0, '09:30', 'Medium', 'in-progress'],
  ['Buy groceries', 'Milk, vegetables and fruit', 1, '17:30', 'Low', 'in-progress'],
  ['Design review', 'Walk through mobile screens', 2, '14:00', 'High', 'in-progress'],
  ['Call Mom', '', 3, '19:00', 'Medium', 'completed'],
  ['Read book', 'Finish chapter six', 5, '20:00', 'Low', 'in-progress'],
  ['Project retrospective', '', 7, '10:00', 'Medium', 'in-progress'],
  ['Dentist appointment', '', 8, '15:30', 'High', 'in-progress'],
  ['Meal prep', '', 10, '12:00', 'Low', 'completed'],
  ['Write blog post', 'Productivity notes', 12, '10:00', 'Medium', 'in-progress'],
  ['Weekend hike', 'Pack water and snacks', 13, '07:00', 'Low', 'in-progress'],
  ['Invoice client', '', -10, '13:00', 'High', 'completed'],
  ['Clean workspace', '', 4, '16:00', 'Low', 'in-progress'],
];

export async function seed() {
  await Task.deleteMany({});
  await Task.insertMany(
    names.map(([title, description, offset, startTime, priority, status]) => ({
      title,
      description,
      date: addDays(monday, offset),
      startTime,
      priority,
      status,
    }))
  );
  console.log('Seeded 15 tasks');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await connectDb();
    await seed();
    process.exit(0);
  })();
}
