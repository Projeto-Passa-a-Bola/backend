const express = require('express');
const routes = require('./routes');
const connectDB = require('./config/database');

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api', routes);

// Rota padrão
app.get('/', (req, res) => {
  res.status(200).json({ msg: "Bem vindo ao Passa Bola" });
});

// Conexão com o banco de dados
connectDB();

module.exports = app;