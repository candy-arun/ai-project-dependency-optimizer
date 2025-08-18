import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const GanttChart = ({ tasks }) => {
  // Transform incoming tasks to Gantt format
  const ganttData = tasks.map(task => ({
    name: task.name,
    duration: task.duration,
    completed: task.completed,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 m-4">
      <h2 className="text-xl font-bold mb-4">📊 Task Gantt Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={ganttData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis
            type="number"
            label={{ value: 'Duration (hrs)', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar
            dataKey="duration"
            fill={({ payload }) => (payload.completed ? "#4ade80" : "#60a5fa")}
            barSize={20}
          >
            <LabelList dataKey="duration" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GanttChart;
