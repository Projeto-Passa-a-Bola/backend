const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // Tipo de usuário
    userType: {
        type: String,
        enum: ['user', 'jogadora', 'tecnico', 'ambos', 'admin'],
        default: 'user'
    },
    // Referência para perfil de jogadora
    jogadoraProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JogadoraCadastrada',
        default: null
    },
    // Referência para perfil de técnico
    tecnicoProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tecnico',
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;