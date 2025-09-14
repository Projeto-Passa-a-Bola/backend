const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JogadoraCadastrada = require('../models/JogadoraCadastrada');

// Registrar nova jogadora
const registerJogadora = async (req, res) => {
    try {
        const { name, lastName, nacionalidade, cpf, senhaJogadora, telefone, dataNascimento, posicao } = req.body;

        // Verificar se já existe jogadora com este CPF
        const jogadoraExistente = await JogadoraCadastrada.findOne({ cpf });
        if (jogadoraExistente) {
            return res.status(400).json({ msg: "Já existe uma jogadora cadastrada com este CPF" });
        }

        // Verificar se já existe jogadora com este telefone
        const telefoneExistente = await JogadoraCadastrada.findOne({ telefone });
        if (telefoneExistente) {
            return res.status(400).json({ msg: "Já existe uma jogadora cadastrada com este telefone" });
        }

        // Criptografar senha
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senhaJogadora, salt);

        // Criar nova jogadora
        const jogadora = new JogadoraCadastrada({
            name,
            lastName,
            nacionalidade,
            cpf,
            senhaJogadora: senhaHash,
            telefone,
            dataNascimento,
            posicao
        });

        await jogadora.save();

        res.status(201).json({
            msg: "Jogadora cadastrada com sucesso! Sua conta foi aprovada automaticamente.",
            jogadora: {
                id: jogadora._id,
                name: jogadora.name,
                lastName: jogadora.lastName,
                cpf: jogadora.cpf,
                aprovada: jogadora.aprovada
            }
        });

    } catch (error) {
        console.error('Erro ao registrar jogadora:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Login de jogadora
const loginJogadora = async (req, res) => {
    try {
        const { cpf, senhaJogadora } = req.body;

        // Buscar jogadora por CPF
        const jogadora = await JogadoraCadastrada.findOne({ cpf });
        if (!jogadora) {
            return res.status(404).json({ msg: "CPF ou senha incorretos" });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senhaJogadora, jogadora.senhaJogadora);
        if (!senhaValida) {
            return res.status(404).json({ msg: "CPF ou senha incorretos" });
        }

        // Jogadora é aprovada automaticamente no registro

        // Gerar token
        const secret = process.env.JOGADORA_SECRET || process.env.SECRET;
        const token = jwt.sign(
            { 
                id: jogadora._id, 
                type: 'jogadora' 
            },
            secret,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            msg: "Login realizado com sucesso",
            token,
            jogadora: {
                id: jogadora._id,
                name: jogadora.name,
                lastName: jogadora.lastName,
                cpf: jogadora.cpf,
                posicao: jogadora.posicao,
                aprovada: jogadora.aprovada
            }
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Buscar jogadoras (Público)
exports.buscarPorNome = async (req, res) => {
    try {
        const { nome } = req.query;
        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório na busca.' });
        }
        const jogadoras = await Jogadora.find({ nome: { $regex: nome, $options: 'i' } });
        res.json(jogadoras);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar jogadoras.' });
    }
};

// Listar jogadoras (Admin)
const listarJogadoras = async (req, res) => {
    try {
        const { aprovada, page = 1, limit = 10 } = req.query;
        
        let filtro = {};
        if (aprovada !== undefined) {
            filtro.aprovada = aprovada === 'true';
        }
        
        const jogadoras = await JogadoraCadastrada.find(filtro)
            .select('-senhaJogadora')
            .populate('time', 'nome codigoUnico grupo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await JogadoraCadastrada.countDocuments(filtro);
        
        res.status(200).json({
            jogadoras,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
        
    } catch (error) {
        console.error('Erro ao listar jogadoras:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Aprovar jogadora (Admin)
const aprovarJogadora = async (req, res) => {
    try {
        const { id } = req.params;
        
        const jogadora = await JogadoraCadastrada.findById(id);
        if (!jogadora) {
            return res.status(404).json({ msg: "Jogadora não encontrada" });
        }
        
        if (jogadora.aprovada) {
            return res.status(400).json({ msg: "Jogadora já está aprovada" });
        }
        
        jogadora.aprovada = true;
        await jogadora.save();
        
        res.status(200).json({
            msg: "Jogadora aprovada com sucesso!",
            jogadora: {
                id: jogadora._id,
                name: jogadora.name,
                lastName: jogadora.lastName,
                cpf: jogadora.cpf,
                aprovada: jogadora.aprovada
            }
        });
        
    } catch (error) {
        console.error('Erro ao aprovar jogadora:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Reprovar jogadora (Admin)
const reprovarJogadora = async (req, res) => {
    try {
        const { id } = req.params;
        
        const jogadora = await JogadoraCadastrada.findById(id);
        if (!jogadora) {
            return res.status(404).json({ msg: "Jogadora não encontrada" });
        }
        
        if (!jogadora.aprovada) {
            return res.status(400).json({ msg: "Jogadora já está reprovada" });
        }
        
        jogadora.aprovada = false;
        await jogadora.save();
        
        res.status(200).json({
            msg: "Jogadora reprovada com sucesso!",
            jogadora: {
                id: jogadora._id,
                name: jogadora.name,
                lastName: jogadora.lastName,
                cpf: jogadora.cpf,
                aprovada: jogadora.aprovada
            }
        });
        
    } catch (error) {
        console.error('Erro ao reprovar jogadora:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

module.exports = {
    registerJogadora,
    loginJogadora,
    listarJogadoras,
    aprovarJogadora,
    reprovarJogadora
};
