const User = require('../models/User');

const getUserById = async (req, res) => {
    const id = req.params.id;
    
    try {
        const user = await User.findById(id, "-senha");

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

module.exports = {
    getUserById
};