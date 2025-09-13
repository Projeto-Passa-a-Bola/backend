const express = require('express');
const { registerJogadora, loginJogadora } = require('../controllers/jogadoraController');
const { 
    validateJogadoraRegistration, 
    validateJogadoraLogin 
} = require('../utils/validators');

const router = express.Router();

router.post('/register', validateJogadoraRegistration, registerJogadora);
router.post('/login', validateJogadoraLogin, loginJogadora);

module.exports = router;