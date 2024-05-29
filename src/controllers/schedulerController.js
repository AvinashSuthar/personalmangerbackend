const Scheduler = require('../models/schedulerModel');
const User = require('../models/userModel');
const scheduleEmail = require('../utils/scheduleMail');
// Create a new scheduler entry
exports.createScheduler = async (req, res) => {
  try {
    const { title, description, scheduledDate } = req.body;
    const newScheduler = new Scheduler({
      title,
      description,
      scheduledDate,
    });
    await newScheduler.save();

    // Update user's scheduler field
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { scheduler: newScheduler._id } },
      { new: true }
    );
    const user = await User.findById(req.userId);
    console.log(user.email);
    scheduleEmail(user.email , title, description , scheduledDate);
    res.status(201).json(newScheduler);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a scheduler entry
exports.updateScheduler = async (req, res) => {
  try {
    const { title, description, scheduledDate } = req.body;
    const updatedScheduler = await Scheduler.findByIdAndUpdate(
      req.params.schedulerId,
      { title, description, scheduledDate },
      { new: true }
    );
    const user = await User.findById(req.userId);
    scheduleEmail(user.email , title, description , scheduledDate);

    res.status(200).json(updatedScheduler);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a scheduler entry
exports.deleteScheduler = async (req, res) => {
  try {
    const deletedScheduler = await Scheduler.findByIdAndDelete(req.params.schedulerId);

    // Update user's scheduler field
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { scheduler: req.params.schedulerId } },
      { new: true }
    );

    res.status(200).json(deletedScheduler);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
