const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  otp: String,
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Notes'
  }],
  todo: [{
    type: Schema.Types.ObjectId,
    ref: 'Todo'
  }],
  diary: [{
    type: Schema.Types.ObjectId,
    ref: 'Diary'
  }],
  goals: [{
    type: Schema.Types.ObjectId,
    ref: 'Goals'
  }],
  scheduler: [{
    type: Schema.Types.ObjectId,
    ref: 'Scheduler'
  }],
  dailyTaskManager: [{
    type: Schema.Types.ObjectId,
    ref: 'DailyTaskManager'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model('User', userSchema);