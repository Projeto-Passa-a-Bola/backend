const mongoose = require('mongoose');

const TimeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    codigoUnico: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        length: 6
    },
    grupo: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    },
    capacidade: {
        type: Number,
        required: true,
        min: 1,
        max: 20,
        default: 11
    },
    jogadoras: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JogadoraCadastrada'
    }],
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ativo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual para calcular jogadoras atuais
TimeSchema.virtual('jogadorasAtuais').get(function() {
    return this.jogadoras ? this.jogadoras.length : 0;
});

// Virtual para calcular vagas restantes
TimeSchema.virtual('vagasRestantes').get(function() {
    return this.capacidade - this.jogadorasAtuais;
});

// Virtual para verificar se tem vaga
TimeSchema.virtual('temVaga').get(function() {
    return this.jogadorasAtuais < this.capacidade;
});

// Método para adicionar jogadora ao time
TimeSchema.methods.adicionarJogadora = async function(jogadoraId) {
    // Verificar se já está no time
    if (this.jogadoras.includes(jogadoraId)) {
        throw new Error('Jogadora já está neste time');
    }
    
    // Verificar se tem vaga
    if (!this.temVaga) {
        throw new Error('Time está lotado');
    }
    
    // Adicionar jogadora
    this.jogadoras.push(jogadoraId);
    await this.save();
    
    return this;
};

// Método para remover jogadora do time
TimeSchema.methods.removerJogadora = async function(jogadoraId) {
    const index = this.jogadoras.indexOf(jogadoraId);
    if (index === -1) {
        throw new Error('Jogadora não está neste time');
    }
    
    this.jogadoras.splice(index, 1);
    await this.save();
    
    return this;
};

// Índices para melhor performance
TimeSchema.index({ codigoUnico: 1 });
TimeSchema.index({ grupo: 1 });
TimeSchema.index({ ativo: 1 });
TimeSchema.index({ criadoPor: 1 });

// Middleware para garantir que o código seja único e maiúsculo
TimeSchema.pre('save', function(next) {
    if (this.codigoUnico) {
        this.codigoUnico = this.codigoUnico.toUpperCase();
    }
    next();
});

const Time = mongoose.model('Time', TimeSchema);

module.exports = Time;
