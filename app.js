// app.js (AJUSTADO PARA ACEITAR TODAS AS ORIGENS)

const express = require('express');
const routes = require('./src/routes/index');
const app = express();
const cors = require('cors'); // Certifique-se de que 'cors' está instalado!

// Middlewares globais
app.use(express.json());

// CONFIGURAÇÃO DE CORS TEMPORÁRIA PARA DIAGNÓSTICO: Aceita TODAS as origens
app.use(cors({
  origin: '*', // Permite qualquer domínio (HTTP/HTTPS) acessar a API
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Mantém os métodos
  credentials: true,
}));

// Rotas
app.use('/api', routes);

// Rota de saúde da aplicação
app.get('/', (req, res) => {
  res.status(200).json({ msg: "Bem vindo ao Passa Bola" });
});

module.exports = app;