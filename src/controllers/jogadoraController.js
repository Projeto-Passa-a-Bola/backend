const bcrypt = require('bcrypt');
const JogadoraCadastrada = require('../models/JogadoraCadastrada');
const { generateJogadoraToken } = require('../services/tokenService');

const registerJogadora = async (req, res) => {
    const {
        name, lastName, nacionalidade, cpf, senhaJogadora,
        telefone, dataNascimento, posicao
    } = req.body;

    try {
        // Verificar se CPF já está cadastrado
        const cpfExiste = await JogadoraCadastrada.findOne({ cpf: cpf });
        if (cpfExiste) {
            return res.status(422).json({ msg: 'Este CPF já está cadastrado!' });
        }

        // Verifica se aquele telefone já foi cadastrado 
        const telefoneExiste = await JogadoraCadastrada.findOne({ telefone: telefone });
        if (telefoneExiste) {
            return res.status(422).json({ msg: 'Este número de telefone já está em uso!' });
        }

        // Criando senha hash
        const saltJogadora = await bcrypt.genSalt(12);
        const passwordHashJogadora = await bcrypt.hash(senhaJogadora, saltJogadora);

        // Criando jogadora
        const jogadora = new JogadoraCadastrada({
            name, lastName, nacionalidade, cpf,
            senhaJogadora: passwordHashJogadora,
            telefone, dataNascimento, posicao,
            aprovada: true
        });

        await jogadora.save();
        res.status(201).json({ msg: "Jogadora cadastrada com sucesso!" });
        
    } catch (error) {
        console.log("Erro ao cadastrar jogadora:", error);
        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"
        });
    }
};

const loginJogadora = async (req, res) => {
    const { cpf, senhaJogadora } = req.body;
    
    try {
        // Verifica se a jogadora existe
        const jogadora = await JogadoraCadastrada.findOne({ cpf: cpf });

        if (!jogadora) {
            return res.status(404).json({ msg: "Jogadora não encontrada" });
        }

        // Verificar senha
        const verificaSenhaJogadora = await bcrypt.compare(senhaJogadora, jogadora.senhaJogadora);
        
        if (!verificaSenhaJogadora) {
            return res.status(422).json({ msg: "Senha inválida!" });
        }

        const token = generateJogadoraToken(jogadora._id);

        let mensagem = "Login de jogadora realizado com sucesso!";
        if (!jogadora.aprovada) {
            mensagem += " Sua conta ainda não foi aprovada.";
        }

        res.status(200).json({
            msg: mensagem,
            token,
            jogadora: {
                id: jogadora._id,
                name: jogadora.name,
                lastName: jogadora.lastName,
                cpf: jogadora.cpf,
                telefone: jogadora.telefone,
                dataNascimento: jogadora.dataNascimento,
                posicao: jogadora.posicao,
                aprovada: jogadora.aprovada
            }
        });
        
    } catch (err) {
        console.log("Erro no login da jogadora:", err);
        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"
        });
    }
};

module.exports = {
    registerJogadora,
    loginJogadora
};