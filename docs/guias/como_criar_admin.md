# 👤 Como Criar um Administrador - Passa Bola

## ⚙️ **Pré-requisitos**

Antes de criar um admin, certifique-se de que:

1. **✅ Servidor está rodando**: `npm start`
2. **✅ Banco de dados configurado**: Arquivo `.env` com credenciais do MongoDB
3. **✅ Variáveis de ambiente**: `DB_USER` e `DB_PASS` configuradas

### **Configurar .env**
Crie um arquivo `.env` na raiz do projeto com:
```env
DB_USER=seu_usuario_mongodb
DB_PASS=sua_senha_mongodb
SECRET=sua_chave_secreta_jwt
JOGADORA_SECRET=sua_chave_secreta_jogadora
PORT=3000
```

## 🎯 **Métodos para Criar um Admin**

Existem 3 formas de criar um administrador no sistema:

### **Método 1: Script Automático (Recomendado)**

Execute o comando no terminal:

```bash
npm run criar-admin
```

**O que o script faz:**
- ✅ Verifica se já existe um admin
- ✅ Cria um admin padrão se não existir
- ✅ Usa credenciais padrão: `admin@passabola.com` / `admin123`

**Saída esperada:**
```
Conectado ao MongoDB
✅ Administrador criado com sucesso!
   Nome: Administrador
   Email: admin@passabola.com
   Senha: admin123
   ID: 64f1a2b3c4d5e6f7g8h9i0j1

🔐 Credenciais de acesso:
   Email: admin@passabola.com
   Senha: admin123
Desconectado do MongoDB
```

### **Método 2: Via API (Postman)**

#### **2.1 Registrar Admin via API**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "Administrador",
  "email": "admin@passabola.com",
  "senha": "admin123",
  "isAdmin": true
}
```

**Resposta esperada:**
```json
{
  "msg": "Usuário criado com sucesso!",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Administrador",
    "email": "admin@passabola.com",
    "isAdmin": true
  }
}
```

#### **2.2 Login do Admin**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@passabola.com",
  "senha": "admin123"
}
```

**Resposta esperada:**
```json
{
  "msg": "Autenticação realizada com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Administrador",
    "email": "admin@passabola.com",
    "isAdmin": true
  }
}
```

### **Método 3: Diretamente no MongoDB**

Se você tem acesso ao MongoDB, pode criar diretamente:

```javascript
// Conectar ao MongoDB
use passabola

// Criar admin
db.users.insertOne({
  name: "Administrador",
  email: "admin@passabola.com",
  senha: "$2b$12$...", // Hash da senha "admin123"
  isAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🔐 **Credenciais Padrão**

Após criar o admin, use estas credenciais:

- **Email**: `admin@passabola.com`
- **Senha**: `admin123`

## ✅ **Verificar se o Admin foi Criado**

### **Via API:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@passabola.com",
  "senha": "admin123"
}
```

### **Via Script:**
```bash
npm run criar-admin
```

Se já existir, o script mostrará:
```
✅ Já existe um administrador no sistema:
   Nome: Administrador
   Email: admin@passabola.com
   ID: 64f1a2b3c4d5e6f7g8h9i0j1
```

## 🚀 **Próximos Passos**

Após criar o admin:

1. **Fazer login** com as credenciais
2. **Copiar o token** da resposta
3. **Usar o token** nas requisições que precisam de admin
4. **Criar times** usando a rota `/api/times/criar`

## 🔧 **Troubleshooting**

### **Erro: "Email já existe"**
Se o email já existir mas não for admin, o script automaticamente atualizará:
```
⚠️  Email já existe, mas não é admin. Atualizando para admin...
✅ Usuário atualizado para administrador!
```

### **Erro de Conexão com MongoDB**
Verifique se:
- ✅ MongoDB está rodando
- ✅ Variável `MONGODB_URI` está configurada no `.env`
- ✅ Banco de dados está acessível

### **Erro: "Usuário não encontrado" no Login**
- ✅ Verifique se o admin foi criado corretamente
- ✅ Confirme o email e senha
- ✅ Execute `npm run criar-admin` para verificar

## 📝 **Notas Importantes**

1. **Segurança**: Altere a senha padrão em produção
2. **Backup**: Mantenha backup das credenciais de admin
3. **Múltiplos Admins**: Você pode criar quantos admins quiser
4. **Permissões**: Apenas usuários com `isAdmin: true` podem acessar rotas administrativas

---

**🎯 Resultado**: Admin criado e pronto para gerenciar o sistema! 🚀
