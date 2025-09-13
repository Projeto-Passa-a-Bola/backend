# API Documentation - Passa Bola

## Base URL
```
http://localhost:3000/api
```

## Authentication
A API utiliza JWT (JSON Web Tokens) para autenticação. Inclua o token no header:
```
Authorization: Bearer <token>
```

## Endpoints

### 🔐 Auth - Usuários Comuns

#### Registrar Usuário
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "confirmasenha": "123456"
}
```

**Response:**
```json
{
  "msg": "Usuário criado com sucesso!"
}
```

#### Login Usuário
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Response:**
```json
{
  "msg": "Autenticação realizada com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 👤 Usuários

#### Buscar Usuário por ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "64f7b8c9d1234567890abcde",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### ⚽ Jogadoras

#### Registrar Jogadora
```http
POST /api/jogadoras/register
```

**Body:**
```json
{
  "name": "Maria",
  "lastName": "Santos",
  "nacionalidade": "Brasileira",
  "cpf": "12345678901",
  "senhaJogadora": "senha123",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "1995-05-15",
  "posicao": "Atacante"
}
```

**Response:**
```json
{
  "msg": "Jogadora cadastrada com sucesso!"
}
```

#### Login Jogadora
```http
POST /api/jogadoras/login
```

**Body:**
```json
{
  "cpf": "12345678901",
  "senhaJogadora": "senha123"
}
```

**Response:**
```json
{
  "msg": "Login de jogadora realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "jogadora": {
    "id": "64f7b8c9d1234567890abcde",
    "name": "Maria",
    "lastName": "Santos",
    "cpf": "12345678901",
    "telefone": "(11) 99999-9999",
    "dataNascimento": "1995-05-15",
    "posicao": "Atacante",
    "aprovada": true
  }
}
```

## Error Responses

### 400 - Bad Request
```json
{
  "msg": "Token inválido"
}
```

### 401 - Unauthorized
```json
{
  "msg": "Acesso negado"
}
```

### 404 - Not Found
```json
{
  "msg": "Usuário não encontrado"
}
```

### 422 - Unprocessable Entity
```json
{
  "msg": "O email é obrigatório"
}
```

### 500 - Internal Server Error
```json
{
  "msg": "Aconteceu um erro no servidor, tente novamente mais tarde!"
}
```

## ⚽ Times

### 🔧 Administração de Times (Admin)

#### Criar Times
```http
POST /api/times/admin/criar
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "quantidade": 8,
  "capacidade": 11
}
```

**Response:**
```json
{
  "msg": "8 times criados com sucesso!",
  "times": [
    {
      "id": "64f7b8c9d1234567890abcde",
      "nome": "Time A1",
      "codigoUnico": "ABC123",
      "grupo": "A",
      "capacidade": 11
    }
  ]
}
```

#### Listar Todos os Times
```http
GET /api/times/admin/listar
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "times": [
    {
      "id": "64f7b8c9d1234567890abcde",
      "nome": "Time A1",
      "codigoUnico": "ABC123",
      "grupo": "A",
      "capacidade": 11,
      "jogadorasAtuais": 5,
      "vagasRestantes": 6,
      "temVaga": true,
      "jogadoras": [...],
      "criadoEm": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Deletar Todos os Times
```http
DELETE /api/times/admin/deletar-todos
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "msg": "8 times deletados com sucesso!"
}
```

#### Obter Estatísticas
```http
GET /api/times/admin/estatisticas
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "estatisticas": {
    "totalTimes": 8,
    "totalJogadoras": 45,
    "timesComVaga": 3,
    "distribuicaoGrupos": [
      {
        "_id": "A",
        "totalTimes": 1,
        "totalJogadoras": 11,
        "capacidadeTotal": 11
      }
    ]
  }
}
```

### 🔍 Consultas Públicas

#### Buscar Time por Código
```http
GET /api/times/buscar/:codigo
```

**Response:**
```json
{
  "time": {
    "id": "64f7b8c9d1234567890abcde",
    "nome": "Time A1",
    "codigoUnico": "ABC123",
    "grupo": "A",
    "capacidade": 11,
    "jogadorasAtuais": 5,
    "vagasRestantes": 6,
    "temVaga": true,
    "jogadoras": [...]
  }
}
```

### 👤 Funcionalidades para Jogadoras

#### Verificar Status da Jogadora
```http
GET /api/times/jogadora/status
Authorization: Bearer <jogadora_token>
```

**Response (Não está em time):**
```json
{
  "emTime": false,
  "msg": "Você não está em nenhum time ainda"
}
```

**Response (Está em time):**
```json
{
  "emTime": true,
  "time": {
    "id": "64f7b8c9d1234567890abcde",
    "nome": "Time A1",
    "codigoUnico": "ABC123",
    "grupo": "A",
    "capacidade": 11
  }
}
```

#### Entrar em Time com Código
```http
POST /api/times/jogadora/entrar-codigo
Authorization: Bearer <jogadora_token>
```

**Body:**
```json
{
  "codigo": "ABC123"
}
```

**Response:**
```json
{
  "msg": "Você foi adicionada ao time com sucesso!",
  "time": {
    "id": "64f7b8c9d1234567890abcde",
    "nome": "Time A1",
    "codigoUnico": "ABC123",
    "grupo": "A",
    "capacidade": 11,
    "jogadorasAtuais": 6
  }
}
```

#### Entrar em Time Aleatório
```http
POST /api/times/jogadora/entrar-aleatorio
Authorization: Bearer <jogadora_token>
```

**Response:**
```json
{
  "msg": "Você foi alocada em um time aleatório com sucesso!",
  "time": {
    "id": "64f7b8c9d1234567890abcde",
    "nome": "Time B2",
    "codigoUnico": "DEF456",
    "grupo": "B",
    "capacidade": 11,
    "jogadorasAtuais": 3
  }
}
```

## 📋 Regras do Sistema de Times

- **Quantidade de Times**: Deve ser um número par (4, 8, 16, 32, etc.)
- **Capacidade**: Entre 1 e 20 jogadoras por time
- **Códigos Únicos**: Formato ABC123 (3 letras + 3 números)
- **Grupos**: Distribuição automática em grupos A, B, C, D, etc.
- **Alocação**: Uma jogadora por vez, não pode estar em dois times
- **Aprovação**: Jogadora deve estar aprovada para entrar em times