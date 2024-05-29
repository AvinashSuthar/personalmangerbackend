const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middlewares/authMiddleware');
router.post('/',authMiddleware, notesController.createNote);
router.put('/:noteId',authMiddleware,  notesController.editNote);
router.delete('/:noteId', authMiddleware,  notesController.destroyNote);
module.exports = router;