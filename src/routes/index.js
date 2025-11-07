const express = require('express');
const authRoutes = require('./authRoutes'); // Mantenha a importação
const userRoutes = require('./userRoutes');
const jogadoraRoutes = require('./jogadoraRoutes');
const tecnicoRoutes = require('./tecnicoRoutes');
const timeRoutes = require('./timeRoutes');

const router = express.Router();

// AQUI ESTÁ A MUDANÇA: Exponha o authRoutes DIRETAMENTE na raiz /api
router.use('/', authRoutes); 
// Mantenha os outros, mas remova o '/auth' daqui.
router.use('/users', userRoutes);
router.use('/jogadoras', jogadoraRoutes);
router.use('/tecnicos', tecnicoRoutes);
router.use('/times', timeRoutes);

module.exports = router;