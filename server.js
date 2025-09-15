require('dotenv').config()
const mongoose = require('mongoose')

const app = require('./app')

//Credenciais do banco
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS



// Conexão com o banco e inicialização do servidor
mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wf7t7ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`)
            console.log("Conectou ao banco!")
        })
    })
    .catch((err) => {
        console.error("Erro ao conectar com o banco:", err)
        process.exit(1)
    })