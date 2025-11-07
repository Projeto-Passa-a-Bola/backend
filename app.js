// app.js (VERSÃO FINAL E SEGURA)

const express = require('express');
const routes = require('./src/routes/index');
const app = express();
const cors = require('cors');

// --- VARIÁVEIS DE ORIGEM CORRIGIDAS ---
// O Render lerá esta URL exata para permitir o tráfego da Vercel.
const VERCEL_FRONTEND_URL = 'https://frontend-ten-opal-69.vercel.app';

// Middlewares globais
app.use(express.json());

// Permite requisições de múltiplos domínios (incluindo a Vercel, HTTPS)
app.use(cors({
  origin: [VERCEL_FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true, // Necessário se você usa tokens ou cookies
}));
// --- FIM DA CORREÇÃO CORS ---

// Rotas
app.use('/api', routes);

// Rota de saúde da aplicação
app.get('/', (req, res) => {
  res.status(200).json({ msg: "Bem vindo ao Passa Bola" });
});

module.exports = app;