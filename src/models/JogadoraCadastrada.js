const mongoose = require('mongoose');

const JogadoraCadastradaSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    nacionalidade: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    senhaJogadora: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true,
        unique: true
    },
    dataNascimento: {
        type: String,
        required: true,
    },
    posicao: {
        type: String,
        required: true,
    },
    aprovada: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const JogadoraCadastrada = mongoose.model('JogadoraCadastrada', JogadoraCadastradaSchema);

module.exports = JogadoraCadastrada;