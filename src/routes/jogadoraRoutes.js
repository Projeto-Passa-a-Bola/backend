const express = require('express');
const { 
    registerJogadora, 
    loginJogadora, 
    listarJogadoras, 
    buscarPorNome
} = require('../controllers/jogadoraController');
const { 
    validateJogadoraRegistration, 
    validateJogadoraLogin 
} = require('../utils/validators');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

const router = express.Router();

// Rotas públicas
router.post('/register', validateJogadoraRegistration, registerJogadora);
router.post('/login', validateJogadoraLogin, loginJogadora);
router.get('/buscar', buscarPorNome);

// Rotas para Admin
router.get('/listar', verificarToken, verificarAdmin, listarJogadoras);

module.exports = router;