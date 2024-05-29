const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyTaskManagerSchema = new Schema({
  task: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DailyTaskManager', dailyTaskManagerSchema);
