const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const jogadoraRoutes = require('./jogadora');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jogadora', jogadoraRoutes);

module.exports = router;