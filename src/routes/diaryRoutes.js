const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const authMiddleware = require('../middlewares/authMiddleware');
router.post('/', authMiddleware, diaryController.createEntry);
router.put('/:id', authMiddleware, diaryController.updateEntry);
router.delete('/:id', authMiddleware, diaryController.deleteEntry);
module.exports = router;
