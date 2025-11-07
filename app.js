// app.js (FINAL COM ROTEAMENTO DESANINHADO)

const express = require('express');
const routes = require('./src/routes/index'); 
const authRoutes = require('./src/routes/authRoutes'); // <--- NOVA IMPORTAÇÃO
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

// ROTA DE LOGIN E REGISTRO (Mapeamento Direto)
// /api/auth + rotas internas (/login, /register)
app.use('/api/auth', authRoutes); 

// OUTRAS ROTAS API
// /api + rotas internas (/users, /jogadoras, etc.)
app.use('/api', routes); 

// Rota de saúde da aplicação
app.get('/', (req, res) => {
  res.status(200).json({ msg: "Servidor está vivo!" });
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