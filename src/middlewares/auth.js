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

// Middleware para verificar se a jogadora está aprovada (agora sempre aprovada)
const checkJogadoraAprovada = async (req, res, next) => {
    try {
        const jogadora = await JogadoraCadastrada.findById(req.jogadoraId);
        
        if (!jogadora) {
            return res.status(404).json({ msg: "Jogadora não encontrada" });
        }
        
        // Jogadora é aprovada automaticamente no registro
        
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

// Middleware para verificar se o usuário é admin
const checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }
        
        // Verificar se o usuário é admin (você pode ajustar esta lógica conforme sua estrutura)
        if (!user.isAdmin) {
            return res.status(403).json({ 
                msg: "Acesso negado. Apenas administradores podem realizar esta ação." 
            });
        }
        
        req.admin = user;
        next();
    } catch (error) {
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Middleware para verificar token (compatível com o controller)
const verificarToken = (req, res, next) => {
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

// Middleware para verificar se é admin
const verificarAdmin = async (req, res, next) => {
    try {
        if (req.userType !== 'user') {
            return res.status(403).json({ 
                msg: "Acesso negado. Apenas administradores podem realizar esta ação." 
            });
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }
        
        if (!user.isAdmin) {
            return res.status(403).json({ 
                msg: "Acesso negado. Apenas administradores podem realizar esta ação." 
            });
        }
        
        req.admin = user;
        next();
    } catch (error) {
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Middleware para verificar se é jogadora
const verificarJogadora = async (req, res, next) => {
    try {
        if (req.userType !== 'jogadora') {
            return res.status(403).json({ 
                msg: "Acesso negado. Apenas jogadoras podem realizar esta ação." 
            });
        }

        const jogadora = await JogadoraCadastrada.findById(req.jogadoraId);
        
        if (!jogadora) {
            return res.status(404).json({ msg: "Jogadora não encontrada" });
        }
        
        // Jogadora é aprovada automaticamente no registro
        
        req.jogadora = jogadora;
        next();
    } catch (error) {
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

module.exports = {
    checkToken,
    checkJogadoraToken,
    checkJogadoraAprovada,
    checkAnyToken,
    checkAdmin,
    verificarToken,
    verificarAdmin,
    verificarJogadora
};