# Passa Bola - Backend

Sistema de gerenciamento para plataforma de futebol feminino.

## 🚀 Tecnologias

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── models/         # Modelos do banco de dados
│   ├── middlewares/    # Middlewares personalizados
│   ├── routes/         # Rotas da API
│   ├── config/         # Configurações
│   ├── utils/          # Utilitários
│   └── services/       # Serviços
├── tests/              # Testes
├── docs/               # Documentação
├── app.js             # Configuração do Express
├── server.js          # Inicialização do servidor
└── package.json       # Dependências
```

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Projeto-Passa-a-Bola/backend.git
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 API Endpoints

### Autenticação de Usuários
- `POST /api/auth/register` - Cadastrar usuário
- `POST /api/auth/login` - Login de usuário

### Usuários
- `GET /api/users/:id` - Buscar usuário por ID (protegida)

### Jogadoras
- `POST /api/jogadoras/register` - Cadastrar jogadora
- `POST /api/jogadoras/login` - Login de jogadora

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:
- Usuários comuns: Token padrão
- Jogadoras: Token com identificador específico

## 📝 Variáveis de Ambiente

```env
DB_USER=seu_usuario_mongodb
DB_PASS=sua_senha_mongodb
SECRET=sua_chave_secreta_jwt
JOGADORA_SECRET=sua_chave_secreta_jogadora_jwt
PORT=3000
NODE_ENV=development
```

## 🧪 Testes

```bash
npm test
```

## 📖 Documentação

Para mais detalhes sobre a API, consulte a [documentação completa](./docs/API.md).

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.