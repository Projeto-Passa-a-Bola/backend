const Time = require('../models/Time');
const JogadoraCadastrada = require('../models/JogadoraCadastrada');
const { gerarCodigoUnico } = require('../utils/codigoGenerator');

// Função para validar se o número de times é par
const validarNumeroParTimes = (quantidade) => {
    if (quantidade % 2 !== 0) {
        throw new Error('A quantidade de times deve ser um número par (4, 8, 16, 32, etc.)');
    }
    
    if (quantidade < 4) {
        throw new Error('A quantidade mínima de times é 4');
    }
    
    if (quantidade > 32) {
        throw new Error('A quantidade máxima de times é 32');
    }
};

// Função para gerar grupos baseado na quantidade de times
const gerarGrupos = (quantidadeTimes) => {
    const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const timesPorGrupo = quantidadeTimes / 8; // Máximo 8 grupos
    
    const distribuicaoGrupos = [];
    for (let i = 0; i < quantidadeTimes; i++) {
        const grupoIndex = Math.floor(i / timesPorGrupo);
        distribuicaoGrupos.push(grupos[grupoIndex]);
    }
    
    return distribuicaoGrupos;
};

// Criar múltiplos times (Admin)
const criarTimes = async (req, res) => {
    try {
        const { quantidade, capacidade = 11 } = req.body;
        const adminId = req.userId;

        // Validar quantidade
        validarNumeroParTimes(quantidade);

        // Verificar se já existem times ativos
        const timesExistentes = await Time.countDocuments({ ativo: true });
        if (timesExistentes > 0) {
            return res.status(400).json({
                msg: "Já existem times ativos. Delete os times existentes antes de criar novos."
            });
        }

        // Gerar grupos
        const grupos = gerarGrupos(quantidade);
        
        // Criar times
        const times = [];
        for (let i = 0; i < quantidade; i++) {
            const codigoUnico = await gerarCodigoUnico();
            const time = new Time({
                nome: `Time ${String.fromCharCode(65 + i)}${i + 1}`,
                codigoUnico,
                grupo: grupos[i],
                capacidade,
                criadoPor: adminId
            });
            times.push(time);
        }

        // Salvar todos os times
        await Time.insertMany(times);

        res.status(201).json({
            msg: `${quantidade} times criados com sucesso!`,
            times: times.map(t => ({
                id: t._id,
                nome: t.nome,
                codigoUnico: t.codigoUnico,
                grupo: t.grupo,
                capacidade: t.capacidade
            }))
        });

    } catch (error) {
        console.error('Erro ao criar times:', error);
        res.status(400).json({ msg: error.message });
    }
};

// Listar todos os times (Admin)
const listarTimes = async (req, res) => {
    try {
        const times = await Time.find({ ativo: true })
            .populate('jogadoras', 'name lastName cpf posicao')
            .populate('criadoPor', 'name email')
            .sort({ grupo: 1, nome: 1 });

        const timesComInfo = times.map(time => ({
            id: time._id,
            nome: time.nome,
            codigoUnico: time.codigoUnico,
            grupo: time.grupo,
            capacidade: time.capacidade,
            jogadorasAtuais: time.jogadorasAtuais,
            vagasRestantes: time.vagasRestantes,
            temVaga: time.temVaga,
            jogadoras: time.jogadoras,
            criadoEm: time.createdAt
        }));

        res.status(200).json({ times: timesComInfo });

    } catch (error) {
        console.error('Erro ao listar times:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Buscar time por código único
const buscarTimePorCodigo = async (req, res) => {
    try {
        const { codigo } = req.params;
        const codigoUpper = codigo.toUpperCase();

        const time = await Time.findOne({ 
            codigoUnico: codigoUpper, 
            ativo: true 
        }).populate('jogadoras', 'name lastName posicao');

        if (!time) {
            return res.status(404).json({ msg: "Código de time inválido" });
        }

        res.status(200).json({
            time: {
                id: time._id,
                nome: time.nome,
                codigoUnico: time.codigoUnico,
                grupo: time.grupo,
                capacidade: time.capacidade,
                jogadorasAtuais: time.jogadorasAtuais,
                vagasRestantes: time.vagasRestantes,
                temVaga: time.temVaga,
                jogadoras: time.jogadoras
            }
        });

    } catch (error) {
        console.error('Erro ao buscar time:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Entrar em time com código (Jogadora)
const entrarComCodigo = async (req, res) => {
    try {
        const { codigo } = req.body;
        const jogadoraId = req.jogadoraId;

        // Verificar se jogadora já está em um time
        const jogadora = await JogadoraCadastrada.findById(jogadoraId);
        if (jogadora.time) {
            return res.status(400).json({ 
                msg: "Você já está em um time. Não é possível entrar em outro time." 
            });
        }

        // Buscar time pelo código
        const time = await Time.findOne({ 
            codigoUnico: codigo.toUpperCase(), 
            ativo: true 
        });

        if (!time) {
            return res.status(404).json({ msg: "Código de time inválido" });
        }

        if (!time.temVaga) {
            return res.status(400).json({ msg: "Este time está lotado" });
        }

        // Adicionar jogadora ao time
        await time.adicionarJogadora(jogadoraId);
        
        // Atualizar jogadora com o time
        await JogadoraCadastrada.findByIdAndUpdate(jogadoraId, { 
            time: time._id 
        });

        res.status(200).json({
            msg: "Você foi adicionada ao time com sucesso!",
            time: {
                id: time._id,
                nome: time.nome,
                codigoUnico: time.codigoUnico,
                grupo: time.grupo,
                capacidade: time.capacidade,
                jogadorasAtuais: time.jogadorasAtuais
            }
        });

    } catch (error) {
        console.error('Erro ao entrar com código:', error);
        res.status(400).json({ msg: error.message });
    }
};

// Entrar em time aleatório (Jogadora)
const entrarTimeAleatorio = async (req, res) => {
    try {
        const jogadoraId = req.jogadoraId;

        // Verificar se jogadora já está em um time
        const jogadora = await JogadoraCadastrada.findById(jogadoraId);
        if (jogadora.time) {
            return res.status(400).json({ 
                msg: "Você já está em um time. Não é possível entrar em outro time." 
            });
        }

        // Buscar time com menos jogadoras e com vaga
        const time = await Time.findOne({ 
            ativo: true,
            $expr: { $lt: [{ $size: "$jogadoras" }, "$capacidade"] }
        }).sort({ 
            $expr: { $size: "$jogadoras" } 
        });

        if (!time) {
            return res.status(400).json({ 
                msg: "Não há times disponíveis com vagas no momento" 
            });
        }

        // Adicionar jogadora ao time
        await time.adicionarJogadora(jogadoraId);
        
        // Atualizar jogadora com o time
        await JogadoraCadastrada.findByIdAndUpdate(jogadoraId, { 
            time: time._id 
        });

        res.status(200).json({
            msg: "Você foi alocada em um time aleatório com sucesso!",
            time: {
                id: time._id,
                nome: time.nome,
                codigoUnico: time.codigoUnico,
                grupo: time.grupo,
                capacidade: time.capacidade,
                jogadorasAtuais: time.jogadorasAtuais
            }
        });

    } catch (error) {
        console.error('Erro ao entrar em time aleatório:', error);
        res.status(400).json({ msg: error.message });
    }
};

// Verificar status da jogadora (se já está em time)
const verificarStatusJogadora = async (req, res) => {
    try {
        const jogadoraId = req.jogadoraId;

        const jogadora = await JogadoraCadastrada.findById(jogadoraId)
            .populate('time', 'nome codigoUnico grupo capacidade');

        if (!jogadora.time) {
            return res.status(200).json({
                emTime: false,
                msg: "Você não está em nenhum time ainda"
            });
        }

        res.status(200).json({
            emTime: true,
            time: {
                id: jogadora.time._id,
                nome: jogadora.time.nome,
                codigoUnico: jogadora.time.codigoUnico,
                grupo: jogadora.time.grupo,
                capacidade: jogadora.time.capacidade
            }
        });

    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Buscar times por nome (público)
exports.buscarPorNome = async (req, res) => {
    try {
        const { nome } = req.query;
        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório na busca.' });
        }
        const times = await Time.find({ nome: { $regex: nome, $options: 'i' } });
        res.json(times);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar times.' });
    }
};

// Deletar todos os times (Admin)
const deletarTodosTimes = async (req, res) => {
    try {
        // Remover referência de time de todas as jogadoras
        await JogadoraCadastrada.updateMany(
            { time: { $exists: true } },
            { $unset: { time: 1 } }
        );

        // Deletar todos os times
        const resultado = await Time.deleteMany({ ativo: true });

        res.status(200).json({
            msg: `${resultado.deletedCount} times deletados com sucesso!`
        });

    } catch (error) {
        console.error('Erro ao deletar times:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

// Estatísticas dos times (Admin)
const obterEstatisticas = async (req, res) => {
    try {
        const totalTimes = await Time.countDocuments({ ativo: true });
        const totalJogadoras = await JogadoraCadastrada.countDocuments({ time: { $exists: true } });
        const timesComVaga = await Time.countDocuments({ 
            ativo: true,
            $expr: { $lt: [{ $size: "$jogadoras" }, "$capacidade"] }
        });

        // Distribuição por grupo
        const distribuicaoGrupos = await Time.aggregate([
            { $match: { ativo: true } },
            {
                $group: {
                    _id: "$grupo",
                    totalTimes: { $sum: 1 },
                    totalJogadoras: { $sum: { $size: "$jogadoras" } },
                    capacidadeTotal: { $sum: "$capacidade" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            estatisticas: {
                totalTimes,
                totalJogadoras,
                timesComVaga,
                distribuicaoGrupos
            }
        });

    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
};

module.exports = {
    criarTimes,
    listarTimes,
    buscarTimePorCodigo,
    entrarComCodigo,
    entrarTimeAleatorio,
    verificarStatusJogadora,
    deletarTodosTimes,
    obterEstatisticas
};
