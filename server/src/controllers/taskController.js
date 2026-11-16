import Task from '../models/Task.js';
import { taskSchema, statusSchema } from '../validators/taskValidator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { dateFromString, isoDay, weekRange } from '../utils/dates.js';

const present = (task) => ({ ...task.toObject(), date: isoDay(task.date) });
const bounds = (start, end) => ({ date: { $gte: start, $lte: end } });
export const createTask = asyncHandler(async (req, res) => {
  const data = taskSchema.parse(req.body);
  const task = await Task.create({ ...data, date: dateFromString(data.date) });
  res.status(201).json({ success: true, data: present(task) });
});
export const listTasks = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.query.date) { const day = dateFromString(req.query.date); filter = bounds(day, day); }
  if (req.query.weekStart) { const { start, end } = weekRange(dateFromString(req.query.weekStart)); filter = bounds(start, end); }
  const tasks = await Task.find(filter).sort({ date: 1, startTime: 1 });
  res.json({ success: true, data: tasks.map(present) });
});
export const getWeeks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().sort({ date: -1 }); const grouped = new Map();
  tasks.forEach((task) => { const { start, end } = weekRange(task.date); const key = isoDay(start); const v = grouped.get(key) || { weekStart: key, weekEnd: isoDay(end), open: 0, completed: 0, total: 0 }; v.total += 1; v[task.status === 'completed' ? 'completed' : 'open'] += 1; grouped.set(key, v); });
  res.json({ success: true, data: [...grouped.values()].sort((a, b) => b.weekStart.localeCompare(a.weekStart)) });
});
export const summary = asyncHandler(async (req, res) => {
  if (!req.query.weekStart) return res.status(400).json({ success: false, message: 'weekStart is required' });
  const { start, end } = weekRange(dateFromString(req.query.weekStart)); const tasks = await Task.find(bounds(start, end));
  const completed = tasks.filter((x) => x.status === 'completed').length; const pending = tasks.length - completed;
  res.json({ success: true, data: { completed, pending, progressPercent: tasks.length ? Math.round(completed / tasks.length * 100) : 0 } });
});
export const search = asyncHandler(async (req, res) => { const q = String(req.query.q || '').trim(); if (!q) return res.json({ success: true, data: [] }); const tasks = await Task.find({ $or: [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }] }).sort({ date: 1 }); res.json({ success: true, data: tasks.map(present) }); });
export const getTask = asyncHandler(async (req, res) => { const task = await Task.findById(req.params.id); if (!task) return res.status(404).json({ success: false, message: 'Task not found' }); res.json({ success: true, data: present(task) }); });
export const updateTask = asyncHandler(async (req, res) => { const data = taskSchema.parse(req.body); const task = await Task.findByIdAndUpdate(req.params.id, { ...data, date: dateFromString(data.date) }, { new: true, runValidators: true }); if (!task) return res.status(404).json({ success: false, message: 'Task not found' }); res.json({ success: true, data: present(task) }); });
export const updateStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true }); if (!task) return res.status(404).json({ success: false, message: 'Task not found' }); res.json({ success: true, data: present(task) }); });
export const deleteTask = asyncHandler(async (req, res) => { const task = await Task.findByIdAndDelete(req.params.id); if (!task) return res.status(404).json({ success: false, message: 'Task not found' }); res.json({ success: true, data: { id: req.params.id } }); });
