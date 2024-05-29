const Diary = require('../models/diaryModel');
const User = require('../models/userModel');

exports.createEntry = async (req, res) => {
  const { entry, mood, weather, tags } = req.body;
  const userId = req.userId;
  try {
    const newEntry = new Diary({
      entry,
      mood,
      weather,
      tags,
    });
    const savedEntry = await newEntry.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.diary.push(savedEntry._id);
    await user.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a diary entry
exports.updateEntry = async (req, res) => {
  const { id } = req.params;
  const { entry, mood, weather, tags } = req.body;
  try {
    const updatedEntry = await Diary.findByIdAndUpdate(
      id,
      { entry, mood, weather, tags },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a diary entry
exports.deleteEntry = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const deletedEntry = await Diary.findByIdAndDelete(id);
    const user = await User.findById(userId);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.diary.pull(deletedEntry._id);
    await user.save();
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
