require('dotenv').config()
const express = require('express')
const mongooso = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Rota publica 

app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo ao Passa Bola"})
})

//Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongooso
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wf7t7ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(()=>{
        app.listen(3000)
        console.log("Conectou ao banco!")
    })
    .catch((err) => console.log(err))

app.listen(3000)

