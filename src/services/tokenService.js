const jwt = require('jsonwebtoken');

const generateUserToken = (userId) => {
    const secret = process.env.SECRET;
    return jwt.sign({ id: userId }, secret);
};

const generateJogadoraToken = (jogadoraId) => {
    const secret = process.env.JOGADORA_SECRET || process.env.SECRET;
    return jwt.sign(
        { 
            id: jogadoraId, 
            type: 'jogadora' 
        }, 
        secret
    );
};

module.exports = {
    generateUserToken,
    generateJogadoraToken
};