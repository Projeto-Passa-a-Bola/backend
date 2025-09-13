const express = require('express');
const { getUserById } = require('../controllers/userController');
const { checkToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/:id', checkToken, getUserById);

module.exports = router;