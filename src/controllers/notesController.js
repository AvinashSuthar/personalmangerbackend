// controllers/notesController.js
const Notes = require('../models/notesModel');
const User = require('../models/userModel');
// Create a note
exports.createNote = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const note = new Notes({ content });
    await note.save();
    user.notes.push(note._id);
    await user.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a note
exports.editNote = async (req, res) => {
  const { content } = req.body;
  const { noteId } = req.params;
  try {
    const note = await Notes.findOneAndUpdate(
      { _id: noteId},
      {
        content,
        createdAt: new Date(), // Update the createdAt field to the current date and time
      },
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a note
exports.destroyNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.userId;
  try {
    const note = await Notes.findOneAndDelete({ _id: noteId});
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    const user = await User.findById(userId);
    user.notes.pull(note._id);
    await user.save();
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};