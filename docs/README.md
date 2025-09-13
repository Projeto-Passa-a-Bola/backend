# 🏆 Passa Bola - Sistema de Gerenciamento de Futebol Feminino

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura do Sistema](#-arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Configuração e Instalação](#-configuração-e-instalação)
6. [Funcionalidades](#-funcionalidades)
7. [API Documentation](#-api-documentation)
8. [Guia de Uso](#-guia-de-uso)
9. [Testes](#-testes)
10. [Deploy](#-deploy)
11. [Contribuição](#-contribuição)
12. [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

O **Passa Bola** é uma plataforma completa de gerenciamento para futebol feminino que permite:

- **Gestão de Usuários**: Administradores e jogadoras
- **Sistema de Times**: Criação e gerenciamento de times
- **Alocação Inteligente**: Jogadoras podem entrar em times por código ou aleatoriamente
- **Autenticação Segura**: JWT tokens para segurança
- **API RESTful**: Interface completa para integração

### 🎯 Objetivos do Sistema

1. **Democratizar o acesso** ao futebol feminino
2. **Facilitar a organização** de times e competições
3. **Automatizar processos** de alocação de jogadoras
4. **Fornecer ferramentas** para administradores gerenciarem o sistema

---

## 🏗️ Arquitetura do Sistema

### 📐 Padrão Arquitetural

O sistema segue o padrão **MVC (Model-View-Controller)** com separação clara de responsabilidades:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │     Models      │    │     Routes      │
│                 │    │                 │    │                 │
│ - authController│    │ - User          │    │ - authRoutes    │
│ - timeController│    │ - Jogadora      │    │ - timeRoutes    │
│ - jogadoraCtrl  │    │ - Time          │    │ - jogadoraRoutes│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Middlewares   │
                    │                 │
                    │ - auth.js       │
                    │ - validators.js │
                    └─────────────────┘
```

### 🔄 Fluxo de Dados

1. **Request** → **Routes** → **Middleware** → **Controller**
2. **Controller** → **Model** → **Database**
3. **Database** → **Model** → **Controller** → **Response**

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** (v16+) - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação e autorização
- **bcrypt** - Criptografia de senhas

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Nodemon** - Desenvolvimento com hot-reload
- **Jest** - Framework de testes
- **Supertest** - Testes de API

### Infraestrutura
- **MongoDB Atlas** - Banco de dados em nuvem
- **Git** - Controle de versão
- **npm** - Gerenciador de pacotes

---

## 📁 Estrutura do Projeto

```
backend/
├── 📁 docs/                          # Documentação
│   ├── README.md                     # Este arquivo
│   ├── API.md                        # Documentação da API
│   ├── COMO_CRIAR_ADMIN.md          # Guia para criar admins
│   ├── COMO_TESTAR.md               # Guia de testes
│   ├── SISTEMA_TIMES.md             # Documentação do sistema de times
│   └── TESTES_POSTMAN.md            # Guia de testes no Postman
├── 📁 scripts/                       # Scripts utilitários
│   └── criar-admin.js               # Script para criar admin
├── 📁 src/                          # Código fonte
│   ├── 📁 config/                   # Configurações
│   │   └── database.js              # Configuração do banco
│   ├── 📁 controllers/              # Controladores (lógica de negócio)
│   │   ├── authController.js        # Autenticação
│   │   ├── jogadoraController.js    # Gerenciamento de jogadoras
│   │   └── timeController.js        # Gerenciamento de times
│   ├── 📁 middlewares/              # Middlewares
│   │   └── auth.js                  # Autenticação e autorização
│   ├── 📁 models/                   # Modelos de dados
│   │   ├── User.js                  # Modelo de usuário
│   │   ├── JogadoraCadastrada.js    # Modelo de jogadora
│   │   └── Time.js                  # Modelo de time
│   ├── 📁 routes/                   # Rotas da API
│   │   ├── index.js                 # Roteador principal
│   │   ├── authRoutes.js            # Rotas de autenticação
│   │   ├── jogadoraRoutes.js        # Rotas de jogadoras
│   │   └── timeRoutes.js            # Rotas de times
│   ├── 📁 services/                 # Serviços
│   │   └── tokenService.js          # Geração de tokens JWT
│   └── 📁 utils/                    # Utilitários
│       ├── codigoGenerator.js       # Geração de códigos únicos
│       └── validators.js            # Validações de dados
├── 📄 .env.example                  # Exemplo de variáveis de ambiente
├── 📄 .gitignore                    # Arquivos ignorados pelo Git
├── 📄 app.js                        # Configuração do Express
├── 📄 package.json                  # Dependências e scripts
├── 📄 server.js                     # Arquivo principal do servidor
└── 📄 debug-rotas.js                # Debug de rotas
```

---

## ⚙️ Configuração e Instalação

### 📋 Pré-requisitos

- **Node.js** v16 ou superior
- **npm** v8 ou superior
- **MongoDB Atlas** (conta gratuita)
- **Git** (opcional, para clonar o repositório)

### 🚀 Instalação Passo a Passo

#### 1. **Clonar o Repositório**
```bash
git clone https://github.com/Projeto-Passa-a-Bola/backend.git
cd backend
```

#### 2. **Instalar Dependências**
```bash
npm install
```

#### 3. **Configurar Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Banco de Dados MongoDB Atlas
DB_USER=seu_usuario_mongodb
DB_PASS=sua_senha_mongodb

# Configurações de Segurança
SECRET=sua_chave_secreta_jwt_super_segura
JOGADORA_SECRET=sua_chave_secreta_jogadora_super_segura

# Configurações do Servidor
PORT=3000
NODE_ENV=development
```

#### 4. **Configurar MongoDB Atlas**

1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie uma conta gratuita
3. Crie um cluster
4. Obtenha a string de conexão
5. Configure as variáveis `DB_USER` e `DB_PASS`

#### 5. **Executar o Servidor**
```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start
```

#### 6. **Verificar se está Funcionando**
Acesse: `http://localhost:3000`

Você deve ver uma mensagem de sucesso ou erro de conexão com o banco.

---

## 🎯 Funcionalidades

### 👤 **Sistema de Usuários**

#### **Administradores**
- ✅ Criar e gerenciar times
- ✅ Aprovar/reprovar jogadoras
- ✅ Visualizar estatísticas
- ✅ Gerenciar configurações do sistema

#### **Jogadoras**
- ✅ Registrar-se no sistema
- ✅ Fazer login
- ✅ Entrar em times
- ✅ Visualizar informações do time

### 🏆 **Sistema de Times**

#### **Criação de Times**
- ✅ Quantidade configurável (4, 8, 16, 32)
- ✅ Códigos únicos automáticos (ABC123)
- ✅ Organização em grupos (A, B, C, D)
- ✅ Capacidade personalizável

#### **Alocação de Jogadoras**
- ✅ **Entrada com Código**: Jogadora insere código único
- ✅ **Entrada Aleatória**: Sistema aloca automaticamente
- ✅ **Validações**: Uma jogadora por time, verificação de vagas
- ✅ **Alocação Inteligente**: Prioriza times com menos jogadoras

### 🔐 **Sistema de Autenticação**

#### **Segurança**
- ✅ JWT tokens para autenticação
- ✅ Senhas criptografadas com bcrypt
- ✅ Middleware de autorização
- ✅ Tokens com expiração

#### **Tipos de Usuário**
- ✅ **Admin**: Acesso total ao sistema
- ✅ **Jogadora**: Acesso limitado às funcionalidades

---

## 📚 API Documentation

### 🔗 **Base URL**
```
http://localhost:3000/api
```

### 🔐 **Autenticação**

Todas as rotas protegidas requerem o header:
```
Authorization: Bearer <token>
```

### 📋 **Endpoints Principais**

#### **Autenticação**
```http
POST /auth/register          # Registrar usuário
POST /auth/login             # Login de usuário
```

#### **Jogadoras**
```http
POST /jogadoras/register     # Registrar jogadora
POST /jogadoras/login        # Login de jogadora
GET  /jogadoras/listar       # Listar jogadoras (admin)
PUT  /jogadoras/aprovar/:id  # Aprovar jogadora (admin)
```

#### **Times**
```http
POST /times/criar            # Criar times (admin)
GET  /times/listar           # Listar times (admin)
GET  /times/estatisticas     # Estatísticas (admin)
POST /times/entrar-codigo    # Entrar com código
POST /times/entrar-aleatorio # Entrar aleatoriamente
GET  /times/meu-status       # Status da jogadora
```

### 📊 **Códigos de Status HTTP**

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **401** - Não autorizado
- **403** - Acesso negado
- **404** - Não encontrado
- **422** - Entidade não processável
- **500** - Erro interno do servidor

---

## 🎮 Guia de Uso

### 👨‍💼 **Para Administradores**

#### **1. Criar um Admin**
```bash
npm run criar-admin
```

#### **2. Fazer Login**
```http
POST /auth/login
{
  "email": "admin@passabola.com",
  "senha": "admin123"
}
```

#### **3. Criar Times**
```http
POST /times/criar
Authorization: Bearer <admin_token>
{
  "quantidade": 8,
  "capacidade": 11
}
```

#### **4. Gerenciar Jogadoras**
```http
GET /jogadoras/listar
Authorization: Bearer <admin_token>
```

### 👩‍⚽ **Para Jogadoras**

#### **1. Registrar-se**
```http
POST /jogadoras/register
{
  "name": "Maria",
  "lastName": "Silva",
  "nacionalidade": "Brasileira",
  "cpf": "12345678901",
  "senhaJogadora": "senha123",
  "telefone": "11999999999",
  "dataNascimento": "1995-05-15",
  "posicao": "Atacante"
}
```

#### **2. Fazer Login**
```http
POST /jogadoras/login
{
  "cpf": "12345678901",
  "senhaJogadora": "senha123"
}
```

#### **3. Entrar em Time**
```http
POST /times/entrar-codigo
Authorization: Bearer <jogadora_token>
{
  "codigo": "ABC123"
}
```

---

## 🧪 Testes

### 📋 **Tipos de Teste**

#### **Testes Manuais**
- ✅ Postman Collection
- ✅ Testes de integração
- ✅ Validação de fluxos

#### **Testes Automatizados**
```bash
npm test
```

### 🔧 **Ferramentas de Teste**

#### **Postman**
1. Importe a collection: `docs/Passa_Bola_Times.postman_collection.json`
2. Importe o environment: `docs/Passa_Bola_Environment.postman_environment.json`
3. Execute os testes na sequência

#### **Testes de API**
```bash
# Testar endpoints específicos
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@passabola.com","senha":"admin123"}'
```

---

## 🚀 Deploy

### 🌐 **Deploy em Produção**

#### **1. Configurar Variáveis de Ambiente**
```env
NODE_ENV=production
PORT=3000
DB_USER=usuario_producao
DB_PASS=senha_producao
SECRET=chave_super_segura_producao
```

#### **2. Build e Deploy**
```bash
npm install --production
npm start
```

#### **3. Usar PM2 (Recomendado)**
```bash
npm install -g pm2
pm2 start server.js --name "passa-bola"
pm2 startup
pm2 save
```

### 🔒 **Considerações de Segurança**

- ✅ Use HTTPS em produção
- ✅ Configure CORS adequadamente
- ✅ Use variáveis de ambiente para secrets
- ✅ Implemente rate limiting
- ✅ Configure logs de segurança

---

## 🤝 Contribuição

### 📝 **Como Contribuir**

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

### 📋 **Padrões de Código**

#### **ESLint**
```bash
npm run lint
npm run lint:fix
```

#### **Convenções**
- ✅ Use camelCase para variáveis
- ✅ Use PascalCase para classes
- ✅ Use UPPER_CASE para constantes
- ✅ Comente funções complexas
- ✅ Use nomes descritivos

### 🧪 **Testes**
- ✅ Escreva testes para novas funcionalidades
- ✅ Mantenha cobertura de testes > 80%
- ✅ Teste casos de erro e sucesso

---

## 🔧 Troubleshooting

### ❌ **Problemas Comuns**

#### **Erro de Conexão com MongoDB**
```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solução:**
1. Verifique se o MongoDB Atlas está ativo
2. Confirme as credenciais no `.env`
3. Verifique a string de conexão

#### **Erro 401 - Não Autorizado**
```
{ "msg": "Acesso negado" }
```

**Solução:**
1. Verifique se o token está sendo enviado
2. Confirme se o token não expirou
3. Verifique se o usuário tem permissão

#### **Erro 422 - Senha Inválida**
```
{ "msg": "Senha inválida!" }
```

**Solução:**
1. Confirme se o usuário existe
2. Verifique se a senha está correta
3. Tente criar um novo usuário

### 📞 **Suporte**

- 📧 **Email**: suporte@passabola.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/Projeto-Passa-a-Bola/backend/issues)
- 📖 **Wiki**: [Documentação Completa](https://github.com/Projeto-Passa-a-Bola/backend/wiki)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

- **Desenvolvedor Principal**: [Seu Nome]
- **Designer**: [Nome do Designer]
- **Product Owner**: [Nome do PO]

---

## 🙏 Agradecimentos

- Comunidade Node.js
- MongoDB Atlas
- Express.js
- Todos os contribuidores

---

**🎯 Passa Bola - Democratizando o futebol feminino através da tecnologia! 🚀**