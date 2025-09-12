const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

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
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wf7t7ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log("Conectou ao banco!");
  })
  .catch((err) => {
    console.log("Erro ao conectar com o banco:", err);
  });

module.exports = app;