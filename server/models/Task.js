// server/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: false },
    predictedDuration: { type: Number },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', TaskSchema);
