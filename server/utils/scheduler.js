// server/utils/scheduler.js
const Task = require('../models/Task');

async function buildGraph() {
    const tasks = await Task.find().lean();
    const taskMap = new Map(); // id -> task
    const graph = new Map();   // id -> list of dependent ids
    const reverseGraph = new Map(); // for latest time calc
    const inDegree = new Map();

    tasks.forEach(task => {
        const id = task._id.toString();
        taskMap.set(id, task);
        graph.set(id, []);
        reverseGraph.set(id, []);
        inDegree.set(id, 0);
    });

    tasks.forEach(task => {
        const id = task._id.toString();
        task.dependencies.forEach(dep => {
            const depId = dep.toString();
            graph.get(depId).push(id);
            reverseGraph.get(id).push(depId);
            inDegree.set(id, inDegree.get(id) + 1);
        });
    });

    return { taskMap, graph, reverseGraph, inDegree };
}

async function criticalPath() {
    const { taskMap, graph, reverseGraph, inDegree } = await buildGraph();
    const topOrder = [];
    const queue = [];

    // Step 1: Topological Sort
    inDegree.forEach((deg, id) => {
        if (deg === 0) queue.push(id);
    });

    while (queue.length > 0) {
        const current = queue.shift();
        topOrder.push(current);
        graph.get(current).forEach(neighbor => {
            inDegree.set(neighbor, inDegree.get(neighbor) - 1);
            if (inDegree.get(neighbor) === 0) queue.push(neighbor);
        });
    }

    if (topOrder.length !== taskMap.size) {
        throw new Error("Cycle detected in task dependencies");
    }

    // Step 2: Forward Pass (Earliest Times)
    const est = {}; // earliest start time
    const eft = {}; // earliest finish time

    topOrder.forEach(id => {
        const duration = taskMap.get(id).duration || 0;
        est[id] = 0;

        const deps = reverseGraph.get(id);
        deps.forEach(dep => {
            est[id] = Math.max(est[id], eft[dep]);
        });

        eft[id] = est[id] + duration;
    });

    // Total project duration
    const projectDuration = Math.max(...Object.values(eft));

    // Step 3: Backward Pass (Latest Times)
    const lft = {}; // latest finish time
    const lst = {}; // latest start time

    // Initialize all finish times to project duration
    taskMap.forEach((_, id) => lft[id] = projectDuration);

    [...topOrder].reverse().forEach(id => {
        const duration = taskMap.get(id).duration || 0;

        graph.get(id).forEach(dep => {
            lft[id] = Math.min(lft[id], lst[dep]);
        });

        lst[id] = lft[id] - duration;
    });

    // Step 4: Calculate Slack & Mark Critical
    const schedule = topOrder.map(id => {
        const slack = lst[id] - est[id];
        return {
            id,
            name: taskMap.get(id).name,
            duration: taskMap.get(id).duration,
            earliestStart: est[id],
            earliestFinish: eft[id],
            latestStart: lst[id],
            latestFinish: lft[id],
            slack,
            isCritical: slack === 0
        };
    });

    return {
        schedule,
        projectDuration
    };
}

module.exports = { criticalPath };
