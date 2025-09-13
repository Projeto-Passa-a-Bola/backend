const express = require('express');
const { 
    registerJogadora, 
    loginJogadora, 
    listarJogadoras, 
    aprovarJogadora, 
    reprovarJogadora 
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

// Rotas para Admin
router.get('/listar', verificarToken, verificarAdmin, listarJogadoras);
router.put('/aprovar/:id', verificarToken, verificarAdmin, aprovarJogadora);
router.put('/reprovar/:id', verificarToken, verificarAdmin, reprovarJogadora);

module.exports = router;