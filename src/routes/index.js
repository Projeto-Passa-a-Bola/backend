const express = require('express');
// Remova: const authRoutes = require('./authRoutes'); 
const userRoutes = require('./userRoutes');
const jogadoraRoutes = require('./jogadoraRoutes');
const tecnicoRoutes = require('./tecnicoRoutes');
const timeRoutes = require('./timeRoutes');

const router = express.Router();

// AQUI ESTÁ A MUDANÇA: APENAS AS ROTAS DE OUTRAS ENTIDADES.
// ROTAS DE AUTH SAEM DAQUI!
router.use('/users', userRoutes);
router.use('/jogadoras', jogadoraRoutes);
router.use('/tecnicos', tecnicoRoutes);
router.use('/times', timeRoutes);

module.exports = router;