import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskForm = ({ refreshData }) => {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('');
  const [dependencies, setDependencies] = useState('');

  const handlePredictDuration = async () => {
    try {
      const res = await axios.post('http://localhost:5001/predict-duration', {
        name: taskName, // ✅ changed from taskName to name
      });
      setDuration(res.data.predictedDuration);
      toast.success(`🧠 Predicted Duration: ${res.data.predictedDuration} hrs`);
    } catch (err) {
      toast.error('❌ Failed to predict duration from ML model');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        name: taskName,
        duration,
        dependencies: dependencies.split(',').map((dep) => dep.trim()),
      });
      setTaskName('');
      setDuration('');
      setDependencies('');
      toast.success('✅ Task created!');
      refreshData();
    } catch (err) {
      toast.error('❌ Failed to create task');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-xl mb-4">
      <h2 className="text-xl font-bold mb-4">➕ Add New Task</h2>

      <input
        type="text"
        placeholder="Task Name"
        className="w-full p-2 mb-2 border rounded"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />

      <div className="flex gap-2 mb-2">
        <input
          type="number"
          placeholder="Duration (hrs)"
          className="flex-1 p-2 border rounded"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={handlePredictDuration}
          className="bg-indigo-500 text-white px-4 rounded"
        >
          🔮 Predict
        </button>
      </div>

      <input
        type="text"
        placeholder="Dependencies (comma-separated)"
        className="w-full p-2 mb-4 border rounded"
        value={dependencies}
        onChange={(e) => setDependencies(e.target.value)}
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
