// app.js (Revisão para garantir consistência)

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Importa o ROTEADOR PRINCIPAL da API
const apiRoutes = require(path.join(__dirname, 'src', 'routes', 'index'));

// Middlewares globais
app.use(express.json());
app.use(cors({
  origin: [
    'https://frontend-ten-opal-69.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
} ));

// --- PONTO ÚNICO DE MONTAGEM DA API ---
// Todas as rotas de 'src/routes/index.js' serão prefixadas com /api
app.use('/api', apiRoutes);

// Rota de saúde
app.get('/', (req, res) => {
  res.status(200).json({ msg: "Servidor está vivo e respondendo!" });
});

// Manipulador de Erro Global
app.use((err, req, res, next) => {
  console.error("ERRO INTERNO NA APLICAÇÃO EXPRESS:", err.stack);
  res.status(500).json({
    msg: "Ocorreu um erro interno na API. Consulte os logs do servidor.",
    internalError: err.message
  });
});

module.exports = app;
