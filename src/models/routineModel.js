const routineSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [{
    title: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
  }],
  date: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model('Routine', routineSchema);