const express = require('express');
const router = express.Router();
const {
    criarTimes,
    listarTimes,
    buscarTimePorCodigo,
    entrarComCodigo,
    entrarTimeAleatorio,
    verificarStatusJogadora,
    deletarTodosTimes,
    obterEstatisticas
} = require('../controllers/timeController');

const { verificarToken, verificarAdmin, verificarJogadora } = require('../middlewares/auth');

// Rotas para Admin
router.post('/criar', verificarToken, verificarAdmin, criarTimes);
router.get('/listar', verificarToken, verificarAdmin, listarTimes);
router.get('/estatisticas', verificarToken, verificarAdmin, obterEstatisticas);
router.delete('/deletar-todos', verificarToken, verificarAdmin, deletarTodosTimes);

// Rotas para Jogadoras
router.get('/buscar/:codigo', buscarTimePorCodigo);
router.post('/entrar-codigo', verificarToken, verificarJogadora, entrarComCodigo);
router.post('/entrar-aleatorio', verificarToken, verificarJogadora, entrarTimeAleatorio);
router.get('/meu-status', verificarToken, verificarJogadora, verificarStatusJogadora);
router.get('/buscar', timeController.buscarPorNome);

module.exports = router;
