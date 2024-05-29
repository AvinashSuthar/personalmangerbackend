const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
  task: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
});
module.exports = mongoose.model('Todo', todoSchema);
