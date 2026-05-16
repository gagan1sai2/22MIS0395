require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Log } = require('./middleware/logger');

// Initialize express app
const app = express();

// Use cors() middleware
app.use(cors());

// Use express.json() middleware
app.use(express.json());

// In-memory array for notifications
let notifications = [];

// GET /notifications route - return all notifications
app.get('/notifications', (req, res) => {
  const token = process.env.TOKEN;
  Log("backend", "info", "routes", "fetched notifications", token);
  res.json(notifications);
});

// POST /notifications route - create new notification
app.post('/notifications', (req, res) => {
  const token = process.env.TOKEN;
  const { title } = req.body;
  
  // Create notification object
  const notification = {
    id: notifications.length + 1,
    title
  };
  
  // Push to notifications array
  notifications.push(notification);
  
  Log("backend", "info", "routes", "notification created", token);
  
  // Return 201 with the new notification
  res.status(201).json(notification);
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
