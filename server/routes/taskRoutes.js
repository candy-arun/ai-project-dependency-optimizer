// server/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Task CRUD routes
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.patch('/:id/complete', taskController.markTaskComplete);

// Analysis routes
router.get('/topological-order', taskController.getTopologicalOrder);
router.get('/critical-path', taskController.getCriticalPath);

module.exports = router;
