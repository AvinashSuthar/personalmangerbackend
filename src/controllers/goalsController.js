const Goals = require('../models/goalsModel');
const User = require('../models/userModel');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const { title, description, targetDate } = req.body;
    const newGoal = new Goals({ title, description, targetDate });
    await newGoal.save();
    const user = await User.findById(req.userId);
    user.goals.push(newGoal._id);
    await user.save();
    res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal', error: error.message });
  }
};

// Update an existing goal
exports.updateGoal = async (req, res) => {
  try {
    const { title, description, targetDate, achieved } = req.body;
    const goal = await Goals.findByIdAndUpdate(req.params.goalId, { title, description, targetDate, achieved }, { new: true });
    res.status(200).json({ message: 'Goal updated successfully', goal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update goal', error: error.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const deletedGoal = await Goals.findByIdAndDelete(goalId);
    const user = await User.findById(req.userId);
    user.goals.push(deletedGoal._id);
    await user.save();
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete goal', error: error.message });
  }
};

// Mark a goal as achieved
exports.markAchievedGoal = async (req, res) => {
  try {
    const goal = await Goals.findByIdAndUpdate(req.params.goalId, { achieved: true }, { new: true });
    res.status(200).json({ message: 'Goal marked as achieved', goal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark goal as achieved', error: error.message });
  }
};
