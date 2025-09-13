const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JogadoraCadastrada = require('../models/JogadoraCadastrada');

// Middleware para usuários comuns
const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(400).json({ msg: "Token invalido" });
    }
};

// Middleware para jogadoras cadastradas
const checkJogadoraToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado - Token de jogadora necessário" });
    }

    try {
        const secret = process.env.JOGADORA_SECRET || process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        
        if (decoded.type !== 'jogadora') {
            return res.status(403).json({ msg: "Token inválido para jogadora" });
        }
        
        req.jogadoraId = decoded.id;
        next();
    } catch (error) {
        res.status(400).json({ msg: "Token de jogadora inválido" });
    }
};

// Middleware para verificar se a jogadora está aprovada
const checkJogadoraAprovada = async (req, res, next) => {
    try {
        const jogadora = await JogadoraCadastrada.findById(req.jogadoraId);
        
        if (!jogadora) {
            return res.status(404).json({ msg: "Jogadora não encontrada" });
        }
        
        if (!jogadora.aprovada) {
            return res.status(403).json({
                msg: "Sua conta ainda não foi aprovada pelos administradores"
            });
        }
        
        req.jogadora = jogadora;
        next();
    } catch (error) {
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Middleware que aceita tanto user quanto jogadora
const checkAnyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        
        if (decoded.type === 'jogadora') {
            req.jogadoraId = decoded.id;
            req.userType = 'jogadora';
        } else {
            req.userId = decoded.id;
            req.userType = 'user';
        }
        
        next();
    } catch (error) {
        res.status(400).json({ msg: "Token inválido" });
    }
};

module.exports = {
    checkToken,
    checkJogadoraToken,
    checkJogadoraAprovada,
    checkAnyToken
};