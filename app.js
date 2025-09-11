require('dotenv').config()
const express = require('express')
const mongooso = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Config json
app.use(express.json());

//importando models
const User =require('./models/User')

// Rota publica 
app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo ao Passa Bola"})
})

//registrando usuario 
app.post('/auth/register', async (req, res)=> {

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
app.post("authuser", async(req, res) =>{

    const {email, senha} = req.body

    //Validacoes 

    if (!email) {
        return res.status(422).json({msg: 'O email é obrigatório'});
    }
    if (!senha) {
        return res.status(422).json({msg: 'A senha é obrigatória'});
    }



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



