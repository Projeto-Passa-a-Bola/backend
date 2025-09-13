const mongoose = require('mongoose');

const JogadoraSchema = new mongoose.Schema({
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
    unique: true,
  },
  senhaJogadora: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  dataNascimento: {
    type: Date,
    required: true,
  },
  posicao: {
    type: String,
    required: true,
  },
});

const Jogadora = mongoose.model('Jogadora', JogadoraSchema);

module.exports = Jogadora;
