const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const schedulerController = require('../controllers/schedulerController');
router.post('/', authMiddleware, schedulerController.createScheduler);
router.put('/:schedulerId', authMiddleware, schedulerController.updateScheduler);
router.delete('/:schedulerId', authMiddleware, schedulerController.deleteScheduler);
module.exports = router;
