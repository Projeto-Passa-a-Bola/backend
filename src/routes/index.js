// src/routes/index.js

const express = require('express');
const router = express.Router();

// --- CORREÇÃO: IMPORTE E USE AS ROTAS DE AUTENTICAÇÃO ---
const authRoutes = require('./authRoutes'); // 1. Importe o authRoutes
const userRoutes = require('./userRoutes');
const jogadoraRoutes = require('./jogadoraRoutes');
const tecnicoRoutes = require('./tecnicoRoutes');
const timeRoutes = require('./timeRoutes');

// 2. Monte o authRoutes com o prefixo '/auth'
// Isso garantirá que as rotas /login e /register sejam encontradas
router.use('/auth', authRoutes);
// --- FIM DA CORREÇÃO ---

// As outras rotas permanecem como estão
router.use('/users', userRoutes);
router.use('/jogadoras', jogadoraRoutes);
router.use('/tecnicos', tecnicoRoutes);
router.use('/times', timeRoutes);

module.exports = router;
