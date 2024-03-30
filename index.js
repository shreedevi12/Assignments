const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MongoDB connection code
mongoose.connect('mongodb://localhost:27017/shopping_portal')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Task model
const Task = mongoose.model('Task', {
    title: String,
    description: String,
    status: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = new Task({ title, description, status });
        await task.save();
        res.status(201).json({ message: 'Task inserted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
//url http://localhost:3000/tasks

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
//url http://localhost:3000/tasks

app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.json(task);
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        
        const task = await Task.findByIdAndUpdate(id, { title, description, status, updatedAt: Date.now() }, { new: true });
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.json({ message: 'Task updated successfully' });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

//url http://localhost:3000/tasks/66080e93e72dc5816ca92fa3

app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await Task.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
