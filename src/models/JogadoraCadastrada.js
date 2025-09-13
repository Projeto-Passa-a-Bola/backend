const mongoose = require('mongoose');

const JogadoraCadastradaSchema  = mongoose.Schema({
    name:{
        type : String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    nacionalidade:{
        type: String,
        required: true,
    },
    cpf:{
        type: String,
        required: true,
    },
    senhaJogadora:{
        type:String,
        require: true
    },
    telefone:{
        type: String,
        required: true,
    },
    dataNascimento:{
        type: String,
        required: true,
    },
    posicao:{
        type: String,
        required: true,
    }
    }, {
    timestamps: true
})

const JogadoraCadastrada = mongoose.model('JogadoraCadastrada', JogadoraCadastradaSchema)

module.exports = JogadoraCadastrada
