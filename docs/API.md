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