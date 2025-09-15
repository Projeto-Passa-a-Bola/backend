const express = require('express');
const routes = require('./src/routes/index');
const app = express();
const cors = require('cors');



// Middlewares globais
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173' // Substitua pela URL do seu frontend
}));

// Rotas
app.use('/api', routes);

// Rota de saúde da aplicação
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo ao Passa Bola" });
});

module.exports = app; 