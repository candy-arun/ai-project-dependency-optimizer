// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskBoard from './components/TaskBoard';
import GanttChart from './components/GanttChart';
import { ToastContainer } from 'react-toastify';
import { FaTasks } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [criticalPath, setCriticalPath] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('❌ Error fetching tasks:', error.message);
    }
  };

  const fetchCriticalPath = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/critical-path');
      setCriticalPath(res.data.criticalPath || []);
    } catch (error) {
      console.error('❌ Error fetching critical path:', error.message);
    }
  };

  const refreshData = () => {
    fetchTasks();
    fetchCriticalPath();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="App px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold my-6 flex items-center gap-2">
        <FaTasks /> AI Task Scheduler
      </h1>

      <TaskForm refreshData={refreshData} />
      <TaskBoard tasks={tasks} criticalPath={criticalPath} refreshData={refreshData} />
      <GanttChart tasks={tasks} criticalPath={criticalPath} />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
