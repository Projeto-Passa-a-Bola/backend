// app.js (CORREÇÃO DE ROTEAMENTO)

const express = require('express');
const routes = require('./src/routes/index');
const app = express();
const cors = require('cors');

// --- VARIÁVEIS DE ORIGEM CORRIGIDAS ---
const VERCEL_FRONTEND_URL = 'https://frontend-ten-opal-69.vercel.app';

// Middlewares globais
app.use(express.json());

// CONFIGURAÇÃO DE CORS
app.use(cors({
  origin: [VERCEL_FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// AQUI ESTÁ A MUDANÇA CRUCIAL:
// Mapeamos diretamente o /api/auth para as rotas authRoutes
app.use('/api/auth', routes); // <-- MUDEI DE /api PARA /api/auth

// Rota de saúde da aplicação (AGORA DEVE SER ACESSADA SEM /api)
app.get('/', (req, res) => {
  res.status(200).json({ msg: "Servidor está vivo!" });
});

module.exports = app;