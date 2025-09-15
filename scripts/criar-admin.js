const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');
require('dotenv').config();

async function criarAdmin() {
    try {
        // Conectar ao banco (usando a mesma configuração do sistema)
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASS;
        
        if (!dbUser || !dbPassword) {
            console.log('❌ Variáveis de ambiente DB_USER e DB_PASS não configuradas!');
            console.log('   Crie um arquivo .env com:');
            console.log('   DB_USER=seu_usuario');
            console.log('   DB_PASS=sua_senha');
            return;
        }
        
        await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wf7t7ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        console.log('Conectado ao MongoDB Atlas');

        // Verificar se já existe um admin
        const adminExistente = await User.findOne({ isAdmin: true });
        if (adminExistente) {
            console.log('✅ Já existe um administrador no sistema:');
            console.log(`   Nome: ${adminExistente.name}`);
            console.log(`   Email: ${adminExistente.email}`);
            console.log(`   ID: ${adminExistente._id}`);
            return;
        }

        // Dados do admin padrão
        const adminData = {
            name: 'Administrador',
            email: 'admin@passabola.com',
            senha: 'admin123',
            isAdmin: true
        };

        // Verificar se o email já existe
        const emailExistente = await User.findOne({ email: adminData.email });
        if (emailExistente) {
            console.log('⚠️  Email já existe, mas não é admin. Atualizando para admin...');
            emailExistente.isAdmin = true;
            await emailExistente.save();
            console.log('✅ Usuário atualizado para administrador!');
            console.log(`   Nome: ${emailExistente.name}`);
            console.log(`   Email: ${emailExistente.email}`);
            return;
        }

        // Criptografar senha
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(adminData.senha, salt);

        // Criar admin
        const admin = new User({
            name: adminData.name,
            email: adminData.email,
            senha: senhaHash,
            isAdmin: true
        });

        await admin.save();

        console.log('✅ Administrador criado com sucesso!');
        console.log(`   Nome: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Senha: ${adminData.senha}`);
        console.log(`   ID: ${admin._id}`);
        console.log('');
        console.log('🔐 Credenciais de acesso:');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Senha: ${adminData.senha}`);

    } catch (error) {
        console.error('❌ Erro ao criar administrador:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado do MongoDB');
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    criarAdmin();
}

module.exports = criarAdmin;
