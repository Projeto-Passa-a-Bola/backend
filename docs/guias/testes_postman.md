# 🧪 Guia de Testes - Sistema de Times (Postman)

## 📋 Pré-requisitos

1. **Servidor rodando**: `http://localhost:3000`
2. **Postman instalado**
3. **Banco de dados MongoDB conectado**

## 🔐 1. Configuração Inicial

### Variáveis de Ambiente no Postman
Crie as seguintes variáveis na aba "Environment" do Postman:

```
base_url: http://localhost:3000/api
admin_token: (será preenchido após login do admin)
jogadora_token: (será preenchido após login da jogadora)
time_codigo: (será preenchido após criar times)
```

## 👤 2. Testes de Autenticação

### 2.1 Registrar Admin (se não existir)
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@passabola.com",
  "senha": "admin123",
  "isAdmin": true
}
```

### 2.2 Login Admin
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@passabola.com",
  "senha": "admin123"
}
```

**💡 Dica**: Copie o token da resposta e cole na variável `admin_token`

### 2.3 Registrar Jogadora
```http
POST {{base_url}}/jogadoras/register
Content-Type: application/json

{
  "name": "Maria",
  "lastName": "Silva",
  "nacionalidade": "Brasileira",
  "cpf": "12345678901",
  "senhaJogadora": "jogadora123",
  "telefone": "11999999999",
  "dataNascimento": "1995-05-15",
  "posicao": "Atacante"
}
```

### 2.4 Login Jogadora
```http
POST {{base_url}}/jogadoras/login
Content-Type: application/json

{
  "cpf": "12345678901",
  "senhaJogadora": "jogadora123"
}
```

**💡 Dica**: Copie o token da resposta e cole na variável `jogadora_token`

## ✅ 3. Jogadoras Aprovadas Automaticamente

**Importante**: As jogadoras são aprovadas automaticamente no registro. Não é necessário aprovação manual do admin.

### 3.1 Listar Todas as Jogadoras (Admin)
```http
GET {{base_url}}/jogadoras/listar
Authorization: Bearer {{admin_token}}
```

### 3.2 Listar Jogadoras por Status (Admin)
```http
GET {{base_url}}/jogadoras/listar?aprovada=true
Authorization: Bearer {{admin_token}}
```

## 🏆 4. Testes do Sistema de Times

### 4.1 Criar Times (Admin)
```http
POST {{base_url}}/times/criar
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "quantidade": 8,
  "capacidade": 11
}
```

**Resposta esperada**:
```json
{
  "msg": "8 times criados com sucesso!",
  "times": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "nome": "Time A1",
      "codigoUnico": "ABC123",
      "grupo": "A",
      "capacidade": 11
    }
  ]
}
```

**💡 Dica**: Copie um dos códigos únicos para a variável `time_codigo`

### 4.2 Listar Times (Admin)
```http
GET {{base_url}}/times/listar
Authorization: Bearer {{admin_token}}
```

### 4.3 Buscar Time por Código (Público)
```http
GET {{base_url}}/times/buscar/{{time_codigo}}
```

### 4.4 Verificar Status da Jogadora
```http
GET {{base_url}}/times/meu-status
Authorization: Bearer {{jogadora_token}}
```

### 4.5 Entrar com Código Único
```http
POST {{base_url}}/times/entrar-codigo
Authorization: Bearer {{jogadora_token}}
Content-Type: application/json

{
  "codigo": "{{time_codigo}}"
}
```

### 4.6 Entrar em Time Aleatório
```http
POST {{base_url}}/times/entrar-aleatorio
Authorization: Bearer {{jogadora_token}}
```

### 4.7 Estatísticas dos Times (Admin)
```http
GET {{base_url}}/times/estatisticas
Authorization: Bearer {{admin_token}}
```

## 🧪 5. Testes de Validação

### 5.1 Testar Quantidade Ímpar de Times
```http
POST {{base_url}}/times/criar
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "quantidade": 7,
  "capacidade": 11
}
```

**Resposta esperada**: Erro 400 - "A quantidade de times deve ser um número par"

### 5.2 Testar Código Inválido
```http
POST {{base_url}}/times/entrar-codigo
Authorization: Bearer {{jogadora_token}}
Content-Type: application/json

{
  "codigo": "CODIGO_INVALIDO"
}
```

**Resposta esperada**: Erro 404 - "Código de time inválido"

### 5.3 Testar Entrada Duplicada
```http
POST {{base_url}}/times/entrar-codigo
Authorization: Bearer {{jogadora_token}}
Content-Type: application/json

{
  "codigo": "{{time_codigo}}"
}
```

**Resposta esperada**: Erro 400 - "Você já está em um time"

## 🔄 6. Fluxo Completo de Teste

### Sequência Recomendada:

1. **Registrar e fazer login do admin**
2. **Registrar e fazer login da jogadora**
3. **Aprovar a jogadora (admin)**
4. **Criar times (admin)**
5. **Verificar status da jogadora** (deve retornar `emTime: false`)
6. **Entrar com código único** ou **entrar em time aleatório**
7. **Verificar status da jogadora** (deve retornar `emTime: true`)
8. **Listar times** para ver a jogadora alocada
9. **Ver estatísticas** para confirmar os números

## 📊 7. Exemplos de Respostas

### Status da Jogadora (não está em time)
```json
{
  "emTime": false,
  "msg": "Você não está em nenhum time ainda"
}
```

### Status da Jogadora (está em time)
```json
{
  "emTime": true,
  "time": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "nome": "Time A1",
    "codigoUnico": "ABC123",
    "grupo": "A",
    "capacidade": 11
  }
}
```

### Jogadora Alocada com Sucesso
```json
{
  "msg": "Você foi adicionada ao time com sucesso!",
  "time": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "nome": "Time A1",
    "codigoUnico": "ABC123",
    "grupo": "A",
    "capacidade": 11,
    "jogadorasAtuais": 1
  }
}
```

## 🚨 8. Códigos de Erro Comuns

- **400**: Dados inválidos ou regras de negócio violadas
- **401**: Token de autenticação inválido ou ausente
- **403**: Acesso negado (não é admin/jogadora ou jogadora não aprovada)
- **404**: Time ou jogadora não encontrada
- **500**: Erro interno do servidor

## 💡 9. Dicas Importantes

1. **Sempre use os tokens** nas requisições que precisam de autenticação
2. **Aprove a jogadora** antes de testar entrada em times
3. **Use variáveis** no Postman para facilitar os testes
4. **Teste os cenários de erro** para validar as validações
5. **Verifique o status** da jogadora antes e depois de cada operação

## 🔧 10. Limpeza para Novos Testes

### Deletar Todos os Times
```http
DELETE {{base_url}}/times/deletar-todos
Authorization: Bearer {{admin_token}}
```

Isso remove todos os times e limpa as referências das jogadoras, permitindo novos testes.

---

**🎯 Objetivo**: Este guia permite testar todas as funcionalidades do sistema de times de forma sistemática e completa!
