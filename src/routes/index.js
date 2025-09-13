const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const jogadoraRoutes = require('./jogadoraRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jogadoras', jogadoraRoutes);

module.exports = router;

