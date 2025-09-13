const express = require('express');
const routes = require('./src/routes/index');

const app = express();


// Middlewares globais
app.use(express.json());

// Rotas
app.use('/api', routes);

// Rota de saúde da aplicação
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo ao Passa Bola" });
});

module.exports = app; 