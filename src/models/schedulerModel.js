  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const schedulerSchema = new Schema({
    title: String,
    description: String,
    scheduledDate: Date,
    createdAt: { type: Date, default: Date.now },
    });
  module.exports = mongoose.model('Scheduler', schedulerSchema);
