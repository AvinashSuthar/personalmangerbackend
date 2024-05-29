const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diarySchema = new Schema({
  entry: {
    type: String,
    required: true
  },
  entryDate: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: String,
    required: false
  },
  weather: {
    type: String,
    required: false
  },
  tags: {
    type: [String],
    required: false
  },
});

module.exports = mongoose.model('Diary', diarySchema);