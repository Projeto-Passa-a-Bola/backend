const express = require('express');
const { 
    registerTecnico, 
    listarTecnicos, 
    buscarPorNome
} = require('../controllers/tecnicoController');
const { 
    validateTecnicoRegistration
} = require('../utils/validators');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

const router = express.Router();

// Rotas públicas
router.post('/register', validateTecnicoRegistration, registerTecnico);
router.get('/buscar', buscarPorNome);

// Rotas para Admin
router.get('/listar', verificarToken, verificarAdmin, listarTecnicos);

module.exports = router;
