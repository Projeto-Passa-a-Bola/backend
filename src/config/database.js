require('dotenv').config()
const mongoose = require('mongoose')

//Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wf7t7ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        console.log("Conectou ao banco!")
    } catch (err) {
        console.log("Erro ao conectar com o banco:", err)
    }
}

module.exports = connectDB



