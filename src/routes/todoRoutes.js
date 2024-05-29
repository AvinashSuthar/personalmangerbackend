const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middlewares/authMiddleware');
router.post('/', authMiddleware, todoController.createTodo);
router.put('/:todoId',authMiddleware,  todoController.updateTodo);
router.delete('/:todoId',authMiddleware, todoController.deleteTodo);
router.patch('/:todoId/markdone',authMiddleware, todoController.markDoneTodo);
module.exports = router;
