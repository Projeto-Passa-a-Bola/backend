# 🔧 Troubleshooting - Passa Bola

## 📋 Índice

1. [Problemas de Instalação](#-problemas-de-instalação)
2. [Problemas de Conexão](#-problemas-de-conexão)
3. [Problemas de Autenticação](#-problemas-de-autenticação)
4. [Problemas de API](#-problemas-de-api)
5. [Problemas de Performance](#-problemas-de-performance)
6. [Problemas de Deploy](#-problemas-de-deploy)
7. [Logs e Debug](#-logs-e-debug)
8. [FAQ](#-faq)

---

## 🚀 Problemas de Instalação

### **Erro: "Cannot find module"**

#### **Sintoma:**
```bash
Error: Cannot find module '../controllers/timeController'
```

#### **Causa:**
- Dependências não instaladas
- Arquivo não existe
- Caminho incorreto

#### **Solução:**
```bash
# 1. Instalar dependências
npm install

# 2. Verificar se o arquivo existe
ls src/controllers/

# 3. Verificar imports
# Certifique-se de que o caminho está correto
```

### **Erro: "Permission denied"**

#### **Sintoma:**
```bash
EACCES: permission denied, access '/usr/local/lib/node_modules'
```

#### **Solução:**
```bash
# Usar nvm para gerenciar versões do Node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Ou usar sudo (não recomendado)
sudo npm install -g npm
```

### **Erro: "Port already in use"**

#### **Sintoma:**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

#### **Solução:**
```bash
# 1. Encontrar processo usando a porta
lsof -i :3000

# 2. Matar o processo
kill -9 <PID>

# 3. Ou usar outra porta
PORT=3001 npm start
```

---

## 🔌 Problemas de Conexão

### **Erro de Conexão com MongoDB**

#### **Sintoma:**
```bash
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

#### **Causas e Soluções:**

##### **1. MongoDB não está rodando (Local)**
```bash
# Iniciar MongoDB
sudo systemctl start mongod

# Verificar status
sudo systemctl status mongod
```

##### **2. Credenciais incorretas (Atlas)**
```bash
# Verificar arquivo .env
cat .env

# Deve conter:
DB_USER=seu_usuario
DB_PASS=sua_senha
```

##### **3. String de conexão incorreta**
```javascript
// Verificar em src/config/database.js
const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.wf7t7ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
```

##### **4. Firewall bloqueando**
```bash
# Verificar se a porta 27017 está aberta
telnet cluster0.wf7t7ee.mongodb.net 27017
```

### **Erro de Timeout**

#### **Sintoma:**
```bash
MongooseServerSelectionError: Server selection timed out after 30000 ms
```

#### **Solução:**
```javascript
// Aumentar timeout em src/config/database.js
mongoose.connect(connectionString, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

---

## 🔐 Problemas de Autenticação

### **Erro 401: "Acesso negado"**

#### **Sintoma:**
```json
{
  "msg": "Acesso negado"
}
```

#### **Causas e Soluções:**

##### **1. Token não enviado**
```javascript
// Verificar se o header está sendo enviado
fetch('/api/times/listar', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

##### **2. Token inválido**
```javascript
// Verificar se o token está correto
console.log('Token:', token);

// Verificar se não expirou
const decoded = jwt.decode(token);
console.log('Expira em:', new Date(decoded.exp * 1000));
```

##### **3. Secret incorreto**
```bash
# Verificar variável de ambiente
echo $SECRET

# Deve ser a mesma usada para gerar o token
```

### **Erro 403: "Acesso negado"**

#### **Sintoma:**
```json
{
  "msg": "Acesso negado. Apenas administradores podem realizar esta ação."
}
```

#### **Solução:**
```javascript
// Verificar se o usuário é admin
const user = await User.findById(userId);
console.log('É admin:', user.isAdmin);

// Se não for admin, atualizar no banco
await User.findByIdAndUpdate(userId, { isAdmin: true });
```

### **Erro: "Token expirado"**

#### **Sintoma:**
```json
{
  "msg": "Token expirado"
}
```

#### **Solução:**
```javascript
// Fazer novo login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@passabola.com',
    senha: 'admin123'
  })
});

const { token } = await response.json();
```

---

## 🌐 Problemas de API

### **Erro 400: "Dados inválidos"**

#### **Sintoma:**
```json
{
  "msg": "A quantidade de times deve ser um número par"
}
```

#### **Solução:**
```javascript
// Verificar dados enviados
const dados = {
  quantidade: 8, // Deve ser par (4, 8, 16, 32)
  capacidade: 11 // Entre 1 e 20
};

// Validar antes de enviar
if (dados.quantidade % 2 !== 0) {
  console.error('Quantidade deve ser par');
}
```

### **Erro 404: "Não encontrado"**

#### **Sintoma:**
```json
{
  "msg": "Código de time inválido"
}
```

#### **Solução:**
```javascript
// Verificar se o código existe
const time = await Time.findOne({ codigoUnico: 'ABC123' });
console.log('Time encontrado:', time);

// Verificar se está ativo
if (time && !time.ativo) {
  console.log('Time não está ativo');
}
```

### **Erro 422: "Senha inválida"**

#### **Sintoma:**
```json
{
  "msg": "Senha inválida!"
}
```

#### **Solução:**
```javascript
// Verificar se o usuário existe
const user = await User.findOne({ email: 'admin@passabola.com' });
console.log('Usuário encontrado:', user);

// Verificar senha
const senhaValida = await bcrypt.compare('admin123', user.senha);
console.log('Senha válida:', senhaValida);

// Se necessário, criar novo usuário
await User.create({
  name: 'Admin',
  email: 'admin@passabola.com',
  senha: await bcrypt.hash('admin123', 12),
  isAdmin: true
});
```

---

## ⚡ Problemas de Performance

### **Queries Lentas**

#### **Sintoma:**
- Respostas demoradas
- Timeout de requisições

#### **Solução:**
```javascript
// 1. Adicionar índices
// Em src/models/Time.js
TimeSchema.index({ codigoUnico: 1 });
TimeSchema.index({ ativo: 1 });
TimeSchema.index({ grupo: 1 });

// 2. Otimizar queries
// ❌ Ruim
const times = await Time.find({}).populate('jogadoras');

// ✅ Bom
const times = await Time.find({ ativo: true })
  .populate('jogadoras', 'name lastName posicao')
  .select('nome codigoUnico grupo capacidade')
  .lean();
```

### **Alto Uso de Memória**

#### **Sintoma:**
- Servidor lento
- Crashes por falta de memória

#### **Solução:**
```javascript
// 1. Usar paginação
const { data, pagination } = await PaginationService.paginate(
  Time,
  { ativo: true },
  { page: 1, limit: 10 }
);

// 2. Usar lean() para queries
const times = await Time.find({}).lean();

// 3. Limitar campos retornados
const times = await Time.find({}, 'nome codigoUnico grupo');
```

---

## 🚀 Problemas de Deploy

### **Erro no Heroku**

#### **Sintoma:**
```bash
Error: Cannot find module 'express'
```

#### **Solução:**
```bash
# 1. Verificar package.json
cat package.json

# 2. Instalar dependências
npm install

# 3. Verificar Procfile
echo "web: node server.js" > Procfile
```

### **Erro de Variáveis de Ambiente**

#### **Sintoma:**
```bash
Error: DB_USER is not defined
```

#### **Solução:**
```bash
# 1. Configurar variáveis no Heroku
heroku config:set DB_USER=seu_usuario
heroku config:set DB_PASS=sua_senha
heroku config:set SECRET=sua_chave_secreta

# 2. Verificar variáveis
heroku config
```

### **Erro de Build**

#### **Sintoma:**
```bash
Build failed: npm ERR! peer dep missing
```

#### **Solução:**
```bash
# 1. Limpar cache
npm cache clean --force

# 2. Deletar node_modules
rm -rf node_modules package-lock.json

# 3. Reinstalar
npm install
```

---

## 📊 Logs e Debug

### **Habilitar Logs Detalhados**

#### **1. Logs de Desenvolvimento**
```javascript
// Em server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}
```

#### **2. Logs de Erro**
```javascript
// Em cada controller
try {
  // Lógica do controller
} catch (error) {
  console.error('Erro no controller:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userId: req.userId,
    path: req.path
  });
  res.status(500).json({ msg: 'Erro interno do servidor' });
}
```

#### **3. Logs de Banco**
```javascript
// Em src/config/database.js
mongoose.set('debug', process.env.NODE_ENV === 'development');
```

### **Debug de Requisições**

#### **1. Middleware de Debug**
```javascript
// Em app.js
app.use((req, res, next) => {
  if (process.env.DEBUG === 'true') {
    console.log('Request:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query
    });
  }
  next();
});
```

#### **2. Debug de Tokens**
```javascript
// Verificar token
const token = req.headers.authorization?.split(' ')[1];
if (token) {
  try {
    const decoded = jwt.decode(token);
    console.log('Token decodificado:', decoded);
  } catch (error) {
    console.log('Erro ao decodificar token:', error.message);
  }
}
```

---

## ❓ FAQ

### **P: Como criar o primeiro admin?**

**R:** Use o script automático:
```bash
npm run criar-admin
```

Ou via API:
```http
POST /api/auth/register
{
  "name": "Admin",
  "email": "admin@passabola.com",
  "senha": "admin123",
  "isAdmin": true
}
```

### **P: Como resetar o banco de dados?**

**R:** 
```bash
# Deletar todos os times
DELETE /api/times/deletar-todos

# Ou conectar no MongoDB e deletar collections
mongo
use passabola
db.users.deleteMany({})
db.jogadorascadastradas.deleteMany({})
db.times.deleteMany({})
```

### **P: Como alterar a porta do servidor?**

**R:**
```bash
# Via variável de ambiente
PORT=3001 npm start

# Ou no arquivo .env
PORT=3001
```

### **P: Como verificar se o servidor está funcionando?**

**R:**
```bash
# Verificar se está rodando
curl http://localhost:3000

# Verificar logs
tail -f logs/app.log

# Verificar processos
ps aux | grep node
```

### **P: Como fazer backup do banco?**

**R:**
```bash
# MongoDB Atlas - usar interface web
# Ou exportar collections
mongoexport --db passabola --collection users --out users.json
mongoexport --db passabola --collection times --out times.json
```

### **P: Como atualizar o sistema?**

**R:**
```bash
# 1. Fazer backup
git stash

# 2. Atualizar código
git pull origin main

# 3. Instalar dependências
npm install

# 4. Reiniciar servidor
pm2 restart passa-bola
```

### **P: Como monitorar performance?**

**R:**
```bash
# Usar PM2 para monitoramento
pm2 monit

# Ver logs em tempo real
pm2 logs passa-bola

# Ver estatísticas
pm2 show passa-bola
```

---

## 🆘 Suporte

### **Canais de Suporte**

1. **📧 Email**: suporte@passabola.com
2. **🐛 Issues**: [GitHub Issues](https://github.com/Projeto-Passa-a-Bola/backend/issues)
3. **📖 Wiki**: [Documentação Completa](https://github.com/Projeto-Passa-a-Bola/backend/wiki)
4. **💬 Discord**: [Servidor da Comunidade](https://discord.gg/passabola)

### **Informações para Suporte**

Ao solicitar suporte, inclua:

1. **Versão do Node.js**: `node --version`
2. **Versão do npm**: `npm --version`
3. **Sistema Operacional**: `uname -a`
4. **Logs de erro**: Copie a mensagem completa
5. **Passos para reproduzir**: Descreva o que estava fazendo
6. **Configuração**: Arquivo `.env` (sem senhas)

### **Template de Issue**

```markdown
## Descrição do Problema
Descreva o problema de forma clara e concisa.

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## Comportamento Esperado
O que deveria acontecer?

## Screenshots
Se aplicável, adicione screenshots.

## Ambiente
- OS: [ex: Windows 10]
- Node.js: [ex: v18.17.0]
- npm: [ex: 9.6.7]

## Logs
```
Cole aqui os logs de erro
```
```

---

**🎯 Com este guia de troubleshooting, você deve conseguir resolver a maioria dos problemas do sistema Passa Bola! 🚀**
