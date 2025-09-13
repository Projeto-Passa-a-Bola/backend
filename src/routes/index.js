const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const jogadoraRoutes = require('./jogadoraRoutes');
const timeRoutes = require('./timeRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jogadoras', jogadoraRoutes);
router.use('/times', timeRoutes);

module.exports = router;

