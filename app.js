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

app.listen(3000)

