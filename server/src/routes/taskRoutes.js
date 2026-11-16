import { Router } from 'express';
import { createTask, deleteTask, getTask, getWeeks, listTasks, search, summary, updateStatus, updateTask } from '../controllers/taskController.js';
const router = Router();
router.post('/', createTask); router.get('/weeks', getWeeks); router.get('/summary', summary); router.get('/search', search); router.get('/', listTasks); router.get('/:id', getTask); router.put('/:id', updateTask); router.patch('/:id/status', updateStatus); router.delete('/:id', deleteTask);
export default router;
