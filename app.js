// app.js (CORREÇÃO FINAL DE CAMINHO COM MÓDULO PATH)

const express = require('express');
const app = express();
const cors = require('cors');
// Importa o módulo 'path' nativo do Node
const path = require('path');

// --- CORREÇÃO DO CAMINHO ---
// 1. Usa path.join para construir caminhos absolutos baseados no diretório atual (__dirname)
// 2. Isso resolve problemas de resolução de caminhos em diferentes ambientes/OS.
const routes = require(path.join(__dirname, 'src', 'routes', 'index'));
const authRoutes = require(path.join(__dirname, 'src', 'routes', 'authRoutes'));
// --- FIM DA CORREÇÃO DE CAMINHO ---


// --- VARIÁVEIS DE ORIGEM CORRIGIDAS ---
const VERCEL_FRONTEND_URL = 'https://frontend-ten-opal-69.vercel.app';

// Middlewares globais
app.use(express.json());

// CONFIGURAÇÃO DE CORS
app.use(cors({
  origin: [VERCEL_FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// ROTA DE LOGIN E REGISTRO (Mapeamento Direto)
app.use('/api/auth', authRoutes);

// OUTRAS ROTAS API
app.use('/api', routes);

// Rota de saúde da aplicação
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