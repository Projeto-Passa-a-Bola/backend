const bcrypt = require('bcrypt');
const User = require('../models/User');
const JogadoraCadastrada = require('../models/JogadoraCadastrada');
const Tecnico = require('../models/Tecnico');
const { generateUserToken } = require('../services/tokenService');

const registerUser = async (req, res) => {
    const { name, email, senha, isAdmin = false } = req.body;
    
    try {
        // Verificando se o usuário existe
        const userExistente = await User.findOne({ email: email });

        if (userExistente) {
            return res.status(422).json({ msg: 'Por favor, utilize outro e-mail!' });
        }
        
        // Criando password hash
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha, salt);

        // Criando usuário
        const user = new User({
            name,
            email,
            senha: passwordHash,
            isAdmin
        });

        await user.save();
        
        res.status(201).json({ 
            msg: "Usuário criado com sucesso!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!',
        });
    }
};

const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verificando se o usuário existe
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        // Verificando se a senha corresponde
        const verificaSenha = await bcrypt.compare(senha, user.senha);
        
        if (!verificaSenha) {
            return res.status(422).json({ msg: "Senha inválida!" });
        }

        const token = generateUserToken(user._id);
        
        res.status(200).json({
            msg: "Autenticação realizada com sucesso",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"
        });
    }
};

// Login unificado - aceita email e senha, retorna dados do usuário e jogadora se existir
const loginUnificado = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Buscar usuário pelo email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        // Verificar senha
        const verificaSenha = await bcrypt.compare(senha, user.senha);
        
        if (!verificaSenha) {
            return res.status(422).json({ msg: "Senha inválida!" });
        }

        // Buscar dados da jogadora se existir
        let jogadoraData = null;
        if (user.jogadoraProfile) {
            jogadoraData = await JogadoraCadastrada.findById(user.jogadoraProfile)
                .select('-senhaJogadora');
        }

        // Buscar dados do técnico se existir
        let tecnicoData = null;
        if (user.tecnicoProfile) {
            tecnicoData = await Tecnico.findById(user.tecnicoProfile);
        }

        const token = generateUserToken(user._id, user.userType);
        
        res.status(200).json({
            msg: "Autenticação realizada com sucesso",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                isAdmin: user.isAdmin,
                isJogadora: !!user.jogadoraProfile,
                isTecnico: !!user.tecnicoProfile
            },
            jogadora: jogadoraData ? {
                id: jogadoraData._id,
                name: jogadoraData.name,
                lastName: jogadoraData.lastName,
                cpf: jogadoraData.cpf,
                telefone: jogadoraData.telefone,
                posicao: jogadoraData.posicao,
                time: jogadoraData.time
            } : null,
            tecnico: tecnicoData ? {
                id: tecnicoData._id,
                name: tecnicoData.name,
                lastName: tecnicoData.lastName,
                cpf: tecnicoData.cpf,
                telefone: tecnicoData.telefone,
                time: tecnicoData.time
            } : null
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    loginUnificado
};