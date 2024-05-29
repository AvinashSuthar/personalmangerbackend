const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/diary', require('./routes/diaryRoutes'));
app.use('/api/goals', require('./routes/goalsRoutes'));
app.use('/api/scheduler', require('./routes/schedulerRoutes'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
