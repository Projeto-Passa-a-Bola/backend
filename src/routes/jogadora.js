const express = require('express');
const JogadoraController = require('../controllers/JogadoraController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/register', JogadoraController.register);
router.post('/login', JogadoraController.login);
router.get('/perfil/:id', authMiddleware, JogadoraController.getPerfil);
router.get('/listar', JogadoraController.listarJogadoras);

module.exports = router;
