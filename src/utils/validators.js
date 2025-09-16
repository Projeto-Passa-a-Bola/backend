const validateUserRegistration = (req, res, next) => {
    const { name, email, senha, confirmasenha } = req.body;
    
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório' });
    }
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' });
    }
    if (!senha) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
    }
    if (senha !== confirmasenha) {
        return res.status(422).json({ msg: 'As senhas não conferem' });
    }
    
    next();
};

const validateUserLogin = (req, res, next) => {
    const { email, senha } = req.body;
    
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' });
    }
    if (!senha) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
    }
    
    next();
};

const validateJogadoraRegistration = (req, res, next) => {
    const {
        nacionalidade, cpf, telefone, dataNascimento, posicao, userEmail
    } = req.body;

    const requiredFields = {
        nacionalidade: 'A nacionalidade é obrigatória',
        cpf: 'O cpf é obrigatório',
        telefone: 'O telefone é obrigatório',
        dataNascimento: 'A data de nascimento é obrigatória',
        posicao: 'A posição é obrigatória',
        userEmail: 'O email do usuário é obrigatório'
    };

    for (const [field, message] of Object.entries(requiredFields)) {
        if (!req.body[field]) {
            return res.status(422).json({ msg: message });
        }
    }
    
    next();
};

const validateJogadoraLogin = (req, res, next) => {
    const { cpf, senhaJogadora } = req.body;
    
    if (!cpf) {
        return res.status(422).json({ msg: 'O cpf é obrigatório' });
    }
    if (!senhaJogadora) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
    }
    
    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateJogadoraRegistration,
      validateJogadoraLogin
};