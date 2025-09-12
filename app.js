const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Config json
app.use(express.json());

//importando models
const User = require('./src/models/User')

// Rota publica 
app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo ao Passa Bola"})
})

//Rota privada 
app.get("/user/:id", checkToken, async(req, res) => {
    const id = req.params.id
    //Verfica se o usuario existe
    const user = await User.findById(id, "-senha") // -senha serve para nao mostrar a senha no metodo GET assim fica sem falhas de seguranca 

    if(!user){
        return res.status(404).json({msg:"Usuario nao encontrado"})
    }
    
    res.status(200).json({ user })
})

function checkToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg : "Acesso negado"})
    }
    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    }catch(error){
        res.status(400).json({msg: "Token invalido"})
    }
}

//registrando usuario 
app.post('/auth/register', async (req, res) => {
    const {name, email, senha, confirmasenha} = req.body
    
    //VALIDACAO
    // VALIDACAO - Verifique todos os campos
    if (!name) {
        return res.status(422).json({msg: 'O nome é obrigatório'});
    }
    if (!email) {
        return res.status(422).json({msg: 'O email é obrigatório'});
    }
    if (!senha) {
        return res.status(422).json({msg: 'A senha é obrigatória'});
    }

    if (senha !== confirmasenha) {
        return res.status(422).json({msg: 'As senhas não conferem'});
    }
    
    // Verificando se o usuario exists
    const userExistente = await User.findOne({email: email})

    if(userExistente){
        return res.status(422).json({msg: 'Por favor, ultilize outro e-mail!'})
    }
    
    //Criando password 
    const salt = await bcrypt.genSalt(12)
    const passsWordHash = await bcrypt.hash(senha, salt)

    //Criando usuario 
    const user = new User({
        name,
        email,
        senha : passsWordHash,
    })

    try{
        await user.save()
        res.status(201).json({msg: "Usuario criado com sucesso!"})
    }catch(error){
        console.log(error)

        res
        .status(500)
        .json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!',
        })
    }
});

// Login User 
app.post("/auth/login", async(req, res) => {
    const {email, senha} = req.body

    //Validacoes 
    if (!email) {
        return res.status(422).json({msg: 'O email é obrigatório'});
    }
    if (!senha) {
        return res.status(422).json({msg: 'A senha é obrigatória'});
    }

    // Verificando se o usuario existe
    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).json({msg: "Usuario nao encontrado!"})
    }

    //Verificando se a senha corresponde
    const verificaSenha = await bcrypt.compare(senha, user.senha)
    
    if(!verificaSenha){
        return res.status(422).json({msg: "Senha invalida!"})
    }

    try{
        const secret = process.env.SECRET

        const token = jwt.sign({
          id: user._id  
        },
        secret,
        )

        res.status(200).json({msg: "Autenticacao real com sucesso", token })
    } catch(err){
        console.log(err)

        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"
        })
    }
})

// Exporta o app para ser usado no server.js
module.exports = app