// app.js (FINAL COM TRATAMENTO DE ERROS)

const express = require('express');
const routes = require('./src/routes/index');
const app = express();
const cors = require('cors');

// --- VARIÁVEIS DE ORIGEM CORRIGIDAS ---
const VERCEL_FRONTEND_URL = 'https://frontend-ten-opal-69.vercel.app';

// Middlewares globais
app.use(express.json());

// CONFIGURAÇÃO DE CORS SEGURA
app.use(cors({
  origin: [VERCEL_FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));
// --- FIM DA CORREÇÃO CORS ---

// Rotas
app.use('/api', routes);

// Rota de saúde da aplicação
app.get('/', (req, res) => {
  res.status(200).json({ msg: "Bem vindo ao Passa Bola" });
});

// NOVO: Manipulador de Erro Global (DEVE VIR APÓS TODAS AS ROTAS E MIDDLEWARES)
app.use((err, req, res, next) => {
  // Isso aparecerá no log do Render se algo na rota ou lógica quebrar
  console.error("ERRO INTERNO NA APLICAÇÃO EXPRESS:", err.stack);

  // Envia uma resposta genérica de erro para o frontend
  res.status(500).json({
    msg: "Ocorreu um erro interno na API. Consulte os logs do servidor.",
    internalError: err.message
  });
});


module.exports = app;