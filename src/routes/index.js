const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const jogadoraRoutes = require('./jogadoraRoutes');
const tecnicoRoutes = require('./tecnicoRoutes');
const timeRoutes = require('./timeRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jogadoras', jogadoraRoutes);
router.use('/tecnicos', tecnicoRoutes);
router.use('/times', timeRoutes);

module.exports = router;

