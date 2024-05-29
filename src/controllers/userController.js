const Note = require('../models/notesModel');
const User = require('../models/userModel');
const Todo = require('../models/todoModel');
const Diary = require('../models/diaryModel');
const Goals = require('../models/goalsModel');
const Scheduler = require('../models/schedulerModel');
const DailyTaskManager = require('../models/dailyTaskModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .populate('notes')
      .populate('todo')
      .populate('diary')
      .populate('goals')
      .populate('scheduler')
      .populate('dailyTaskManager')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({user});
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ error: 'Email not verified' });
    }
    user.username = username;
    user.password = hashedPassword;
    const savedUser = await user.save();
    user.isVerified= false;
    const token = jwt.sign({ id: savedUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(201).json({user : savedUser,
      token});
  } catch (err) {
    next(err);
  }
};



exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId; // Get the authenticated user's ID from the request

    const user = await User.findById(userId); // Fetch the user by ID
    console.log("done");
    if (!user) {
    console.log("not done");

      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};


// controllers/userController.js

exports.destroyUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log("iam don");
    // Find the user
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated notes, todos, diary entries, goals, scheduler entries, and daily task manager data
    await Promise.all([
      Note.deleteMany({ _id: { $in: user.notes } }),
      Todo.deleteMany({ _id: { $in: user.todo } }),
      Diary.deleteMany({ _id: { $in: user.diary } }),
      Goals.deleteMany({ _id: { $in: user.goals } }),
      Scheduler.deleteMany({ _id: { $in: user.scheduler } }),
      DailyTaskManager.deleteMany({ _id: { $in: user.dailyTaskManager } }),
    ]);

    // Delete the user
    await User.deleteOne({ _id: userId });

    res.status(204).end(); // Send a success response with no content
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    
    res.status(201).json({user : user,
      token});
  } catch (error) {
    res.status(500).send('Error logging in');
  }
};


