const bcrypt = require('bcrypt');
const User = require('../models/User');
const Tecnico = require('../models/Tecnico');
const { generateJogadoraToken } = require('../services/tokenService');

// Registro de técnico
const registerTecnico = async (req, res) => {
    try {
        const {
            nacionalidade,
            cpf,
            telefone,
            dataNascimento,
            userEmail
        } = req.body;

        // Verificar se CPF/telefone já existe
        const existente = await Tecnico.findOne({ $or: [{ cpf }, { telefone }] });
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

        // Verificar se já tem perfil de técnico
        if (user.tecnicoProfile) {
            return res.status(400).json({ 
                msg: 'Este usuário já possui perfil de técnico.' 
            });
        }

        // Criar técnico usando dados do usuário + dados específicos
        const tecnico = new Tecnico({
            name: user.name.split(' ')[0],  // Primeiro nome do usuário
            lastName: user.name.split(' ').slice(1).join(' ') || '',  // Resto do nome
            nacionalidade, cpf, telefone, dataNascimento
        });
        await tecnico.save();

        // Determinar o novo tipo de usuário
        let novoUserType = 'tecnico';
        if (user.jogadoraProfile) {
            novoUserType = 'ambos';  // Se já tem perfil de jogadora, vira 'ambos'
        }

        // Vincular técnico ao usuário
        await User.findByIdAndUpdate(user._id, {
            tecnicoProfile: tecnico._id,
            userType: novoUserType
        });

        const token = generateJogadoraToken(tecnico._id);

        return res.status(201).json({
            msg: 'Perfil de técnico criado e vinculado com sucesso!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: novoUserType
            },
            tecnico: {
                id: tecnico._id,
                name: tecnico.name,
                lastName: tecnico.lastName,
                cpf: tecnico.cpf,
                telefone: tecnico.telefone
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

// Listar técnicos (rota protegida para admin)
const listarTecnicos = async (req, res) => {
    try {
        const tecnicos = await Tecnico.find({}).select('-senhaJogadora');
        return res.status(200).json({ tecnicos });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

// Buscar técnicos por nome
const buscarPorNome = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ msg: 'Parâmetro de busca "q" é obrigatório' });
        }

        const regex = new RegExp(q, 'i');
        const tecnicos = await Tecnico.find({
            $or: [
                { name: regex },
                { lastName: regex }
            ]
        });

        return res.status(200).json({ tecnicos });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

module.exports = {
    registerTecnico,
    listarTecnicos,
    buscarPorNome
};
