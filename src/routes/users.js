const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/:id', authMiddleware, UserController.getUserById);

module.exports = router;