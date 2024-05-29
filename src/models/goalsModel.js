const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalsSchema = new Schema({
  title: String,
  description: String,
  targetDate: Date,
  achieved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Goals', goalsSchema);
