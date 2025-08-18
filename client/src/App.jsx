import React, { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskBoard from './components/TaskBoard';
import GanttChart from './components/GanttChart';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [criticalPath, setCriticalPath] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }

    try {
      const criticalRes = await axios.get('http://localhost:5000/api/tasks/critical-path');
      setCriticalPath(criticalRes.data);
    } catch (error) {
      console.error('Error fetching critical path:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <ToastContainer />
      <div className="max-w-6xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          🧠 Project Dependency Optimizer
        </h1>

        <TaskForm refreshData={fetchData} />
        <TaskBoard tasks={tasks} criticalPath={criticalPath} refreshData={fetchData} />

        {/* ✅ Add Gantt Chart Here */}
        <GanttChart tasks={tasks} />

      </div>
    </div>
  );
}

export default App;
