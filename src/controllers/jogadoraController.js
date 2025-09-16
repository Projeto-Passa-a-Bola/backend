const bcrypt = require('bcrypt');
const User = require('../models/User');
const JogadoraCadastrada = require('../models/JogadoraCadastrada');
const { generateJogadoraToken } = require('../services/tokenService');

// Registro de jogadora (aprovada automaticamente)
const registerJogadora = async (req, res) => {
    try {
        const {
            nacionalidade,
            cpf,
            telefone,
            dataNascimento,
            posicao,
            userEmail
        } = req.body;

        // Verificar se CPF/telefone já existe
        const existente = await JogadoraCadastrada.findOne({ $or: [{ cpf }, { telefone }] });
        if (existente) {
            return res.status(422).json({ msg: 'CPF ou telefone já cadastrado' });
        }

        // Buscar o usuário
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ 
                msg: 'Usuário não encontrado. Faça primeiro o cadastro como usuário comum.' 
            });
        }

        // Verificar se já tem perfil de jogadora
        if (user.jogadoraProfile) {
            return res.status(400).json({ 
                msg: 'Este usuário já possui perfil de jogadora.' 
            });
        }

        // Criar jogadora usando dados do usuário + dados específicos
        const jogadora = new JogadoraCadastrada({
            name: user.name.split(' ')[0],  // Primeiro nome do usuário
            lastName: user.name.split(' ').slice(1).join(' ') || '',  // Resto do nome
            nacionalidade, cpf, telefone, dataNascimento, posicao,
            senhaJogadora: user.senha  // Usar a mesma senha do usuário
        });
        await jogadora.save();

        // Determinar o novo tipo de usuário
        let novoUserType = 'jogadora';
        if (user.tecnicoProfile) {
            novoUserType = 'ambos';  // Se já tem perfil de técnico, vira 'ambos'
        }

        // Vincular jogadora ao usuário
        await User.findByIdAndUpdate(user._id, {
            jogadoraProfile: jogadora._id,
            userType: novoUserType
        });

        const token = generateJogadoraToken(jogadora._id);

        return res.status(201).json({
            msg: 'Perfil de jogadora criado e vinculado com sucesso!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: novoUserType
            },
            jogadora: {
                id: jogadora._id,
                name: jogadora.name,
                lastName: jogadora.lastName,
                cpf: jogadora.cpf,
                telefone: jogadora.telefone,
                posicao: jogadora.posicao
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

// Login de jogadora por CPF e senha
const loginJogadora = async (req, res) => {
    try {
        const { cpf, senhaJogadora } = req.body;

        const jogadora = await JogadoraCadastrada.findOne({ cpf });
        if (!jogadora) {
            return res.status(404).json({ msg: 'Jogadora não encontrada' });
        }

        const senhaConfere = await bcrypt.compare(senhaJogadora, jogadora.senhaJogadora);
        if (!senhaConfere) {
            return res.status(422).json({ msg: 'Senha inválida' });
        }

        const token = generateJogadoraToken(jogadora._id);

        return res.status(200).json({
            msg: 'Autenticação realizada com sucesso',
            token,
            jogadora: {
                id: jogadora._id,
                name: jogadora.name,
                lastName: jogadora.lastName,
                cpf: jogadora.cpf,
                telefone: jogadora.telefone,
                posicao: jogadora.posicao,
                aprovada: jogadora.aprovada
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

// Listar jogadoras (rota protegida para admin, middlewares já validam)
const listarJogadoras = async (req, res) => {
    try {
        const jogadoras = await JogadoraCadastrada.find({}).select('-senhaJogadora');
        return res.status(200).json({ jogadoras });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};


// Buscar jogadoras por nome (name ou lastName)
const buscarPorNome = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ msg: 'Parâmetro de busca "q" é obrigatório' });
        }

        const regex = new RegExp(q, 'i');
        const jogadoras = await JogadoraCadastrada.find({
            $or: [
                { name: regex },
                { lastName: regex }
            ]
        }).select('-senhaJogadora');

        return res.status(200).json({ jogadoras });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

module.exports = {
    registerJogadora,
    loginJogadora,
    listarJogadoras,
    buscarPorNome
};


