const Todo = require('../models/todoModel');
const User = require('../models/userModel'); // Assuming you have a User model

// Create a new todo
exports.createTodo = async (req, res) => {
  const { task, dueDate } = req.body;
  const userId = req.userId;

  try {
    const newTodo = new Todo({
      task,
      dueDate,
      completed: false,
    });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const savedTodo = await newTodo.save();
    user.todo.push(savedTodo._id);
    await user.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing todo
exports.updateTodo = async (req, res) => {
  const { task, dueDate } = req.body;
  const { todoId } = req.params;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { task, dueDate },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  const userId = req.userId; // Getting userId from authMiddleware
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    user.todo.pull(deletedTodo._id);
    await user.save();

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a todo as done
exports.markDoneTodo = async (req, res) => {
  const { todoId } = req.params;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { completed: true },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
