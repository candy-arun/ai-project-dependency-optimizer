// src/api/taskApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ai-project-dependency-optimizer.onrender.com/',
});

// ✅ Create a new task
export const createTask = (taskData) => API.post('/tasks', taskData);

// ✅ Fetch all tasks
export const fetchTasks = () => API.get('/tasks');

// ✅ Fetch topological order (update endpoint if needed)
export const fetchSchedule = () => API.get('/schedule');

// ✅ Mark a task as completed
export const completeTask = (taskId) => API.patch(`/tasks/${taskId}/complete`);
