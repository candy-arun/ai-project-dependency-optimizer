// server/controllers/taskController.js

const Task = require('../models/Task');

// ✅ Create a new task
const createTask = async (req, res) => {
  try {
    const { name, duration, dependencies = [] } = req.body;

    if (!name || isNaN(duration)) {
      return res.status(400).json({ error: 'Name and valid duration are required' });
    }

    // Fetch dependency ObjectIds by task name
    const dependencyIds = [];
    for (const depName of dependencies) {
      const depTask = await Task.findOne({ name: depName.trim() });
      if (depTask) {
        dependencyIds.push(depTask._id);
      }
    }

    const newTask = new Task({
      name,
      duration: Number(duration),
      dependencies: dependencyIds,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('❌ Failed to create task:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Get all tasks with computed start and end times
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('dependencies', 'name duration');

    // Build taskMap and dependency graph
    const taskMap = {};
    const indegree = {};
    const graph = {};

    tasks.forEach(task => {
      taskMap[task._id] = task;
      indegree[task._id] = 0;
      graph[task._id] = [];
    });

    tasks.forEach(task => {
      task.dependencies.forEach(dep => {
        graph[dep._id].push(task._id);
        indegree[task._id]++;
      });
    });

    // Topological Sort to calculate start times
    const queue = tasks.filter(t => indegree[t._id] === 0).map(t => t._id);
    const startTimes = {};
    
    queue.forEach(id => startTimes[id] = 0);

    while (queue.length > 0) {
      const current = queue.shift();
      const currEnd = startTimes[current] + taskMap[current].duration;

      graph[current].forEach(neighborId => {
        startTimes[neighborId] = Math.max(startTimes[neighborId] || 0, currEnd);
        indegree[neighborId]--;
        if (indegree[neighborId] === 0) queue.push(neighborId);
      });
    }

    // Attach start & end times to each task
    const enrichedTasks = tasks.map(task => ({
      ...task.toObject(),
      start: parseFloat(startTimes[task._id]?.toFixed(2)) || 0,
      end: parseFloat((startTimes[task._id] + task.duration)?.toFixed(2)) || task.duration
    }));

    res.json(enrichedTasks);
  } catch (error) {
    console.error('❌ Failed to fetch tasks:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// ✅ Mark a task as complete
const markTaskComplete = async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log('Marking complete for:', taskId);

    const updated = await Task.findByIdAndUpdate(taskId, { completed: true }, { new: true });

    if (!updated) return res.status(404).json({ error: 'Task not found' });

    res.json(updated);
  } catch (error) {
    console.error('❌ Failed to mark task complete:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 🟡 Placeholder: Topological Sort
const getTopologicalOrder = async (req, res) => {
  res.status(501).json({ message: 'Topological sort not implemented yet' });
};

// 🟡 Placeholder: Critical Path
const getCriticalPath = async (req, res) => {
  try {
    const tasks = await Task.find();
    const criticalPath = tasks.filter(t => !t.dependencies.length).map(t => t._id);
    res.json({ criticalPath });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute critical path' });
  }
};

// ✅ Export
module.exports = {
  createTask,
  getAllTasks,
  markTaskComplete,
  getTopologicalOrder,
  getCriticalPath,
};
