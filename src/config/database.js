const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASS;
        
        await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.wf7t7ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        );
        
        console.log("Conectou ao banco!");
    } catch (error) {
        console.error("Erro ao conectar com o banco:", error);
        process.exit(1);
    }
};