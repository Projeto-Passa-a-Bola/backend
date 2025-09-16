const mongoose = require('mongoose');

const TecnicoSchema = new mongoose.Schema({
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
    telefone: {
        type: String,
        required: true,
        unique: true
    },
    dataNascimento: {
        type: String,
        required: true,
    },
    time: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Time',
        default: null
    }
}, {
    timestamps: true
});

const Tecnico = mongoose.model('Tecnico', TecnicoSchema);

module.exports = Tecnico;
