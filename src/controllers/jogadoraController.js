const bcrypt = require('bcrypt');
const JogadoraCadastrada = require('../models/JogadoraCadastrada');
const { generateJogadoraToken } = require('../services/tokenService');

// Registro de jogadora (aprovada automaticamente)
const registerJogadora = async (req, res) => {
    try {
        const {
            name,
            lastName,
            nacionalidade,
            cpf,
            senhaJogadora,
            telefone,
            dataNascimento,
            posicao
        } = req.body;

        const existente = await JogadoraCadastrada.findOne({ $or: [{ cpf }, { telefone }] });
        if (existente) {
            return res.status(422).json({ msg: 'CPF ou telefone já cadastrado' });
        }

        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senhaJogadora, salt);

        const jogadora = new JogadoraCadastrada({
            name,
            lastName,
            nacionalidade,
            cpf,
            senhaJogadora: senhaHash,
            telefone,
            dataNascimento,
            posicao,
            aprovada: true
        });

        await jogadora.save();

        const token = generateJogadoraToken(jogadora._id);

        return res.status(201).json({
            msg: 'Jogadora cadastrada com sucesso',
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
        const { aprovadas } = req.query; // opcional: filtrar por aprovação
        const filtro = {};
        if (aprovadas === 'true') filtro.aprovada = true;
        if (aprovadas === 'false') filtro.aprovada = false;

        const jogadoras = await JogadoraCadastrada.find(filtro).select('-senhaJogadora');
        return res.status(200).json({ jogadoras });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

// Aprovar jogadora (flag booleana)
const aprovarJogadora = async (req, res) => {
    try {
        const { id } = req.params;
        const jogadora = await JogadoraCadastrada.findByIdAndUpdate(
            id,
            { aprovada: true },
            { new: true }
        ).select('-senhaJogadora');

        if (!jogadora) {
            return res.status(404).json({ msg: 'Jogadora não encontrada' });
        }

        return res.status(200).json({ msg: 'Jogadora aprovada', jogadora });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

// Reprovar jogadora (flag booleana)
const reprovarJogadora = async (req, res) => {
    try {
        const { id } = req.params;
        const jogadora = await JogadoraCadastrada.findByIdAndUpdate(
            id,
            { aprovada: false },
            { new: true }
        ).select('-senhaJogadora');

        if (!jogadora) {
            return res.status(404).json({ msg: 'Jogadora não encontrada' });
        }

        return res.status(200).json({ msg: 'Jogadora reprovada', jogadora });
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
    aprovarJogadora,
    reprovarJogadora,
    buscarPorNome
};


