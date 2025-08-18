import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskBoard = ({ tasks = [], criticalPath = [], refreshData }) => {
  const markComplete = async (taskId) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/complete`);
      toast.success(`✅ Task marked as complete!`);
      refreshData();
    } catch (error) {
      console.error('❌ Failed to mark task complete:', error.message);
      toast.error('Error marking task complete.');
    }
  };

  return (
    <div className="task-board grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            className={`p-4 rounded-xl shadow-md border transition-all duration-300
              ${task.completed ? 'bg-green-100 border-green-300' : 'bg-white'}
              ${
                criticalPath.includes(task._id)
                  ? 'border-red-600 bg-red-50 ring-2 ring-red-300'
                  : ''
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => markComplete(task._id)}
                  className="mr-2"
                />
                <span
                  className={`text-lg font-semibold ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.name}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                  task.completed ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'
                }`}
              >
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>

            <div className="text-sm text-gray-700 mb-1">
              ⏱ <strong>Duration:</strong> {task.duration} hrs
            </div>

            <div className="text-sm text-gray-700">
              <strong>Depends on:</strong>{' '}
              {Array.isArray(task.dependencies) && task.dependencies.length > 0
                ? task.dependencies
                    .map((dep) =>
                      typeof dep === 'object' && dep.name ? dep.name : 'Unknown'
                    )
                    .join(', ')
                : 'None'}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskBoard;
