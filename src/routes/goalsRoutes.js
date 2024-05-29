const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const goalsController = require('../controllers/goalsController');
router.post('/', authMiddleware, goalsController.createGoal);
router.put('/:goalId', authMiddleware, goalsController.updateGoal);
router.delete('/:goalId', authMiddleware, goalsController.deleteGoal);
router.patch('/:goalId/markachieved', authMiddleware, goalsController.markAchievedGoal);
module.exports = router;
