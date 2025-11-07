const express = require('express');
const { registerUser, loginUser, loginUnificado } = require('../controllers/authController');
const { validateUserRegistration, validateUserLogin } = require('../utils/validators');

const router = express.Router();

router.post('/register', validateUserRegistration, registerUser);
// router.post('/login', validateUserLogin, loginUser);
router.post('/login-unificado', validateUserLogin, loginUnificado);

module.exports = router;