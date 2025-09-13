# 🧪 Como Testar o Sistema de Times - Passa Bola

## 🚀 Início Rápido

### 1. **Importar no Postman**
1. Abra o Postman
2. Clique em "Import"
3. Importe os arquivos:
   - `docs/Passa_Bola_Times.postman_collection.json`
   - `docs/Passa_Bola_Environment.postman_environment.json`

### 2. **Configurar Ambiente**
1. Selecione o ambiente "Passa Bola - Local"
2. Verifique se `base_url` está como `http://localhost:3000/api`

### 3. **Executar Sequência de Testes**

## 📋 Sequência Recomendada de Testes

### **Passo 1: Autenticação**
1. **Registrar Admin** → Copie o token para `admin_token`
2. **Login Admin** → Confirme que o token foi salvo
3. **Registrar Jogadora** → Anote o ID da jogadora
4. **Login Jogadora** → Copie o token para `jogadora_token`

### **Passo 2: Sistema de Times (Admin)**
1. **Criar Times** → Cria 8 times com códigos únicos
2. **Listar Times** → Veja todos os times criados
3. **Estatísticas dos Times** → Veja os números gerais

### **Passo 3: Sistema de Times (Jogadora)**
1. **Verificar Status da Jogadora** → Deve retornar `emTime: false`
2. **Buscar Time por Código** → Veja informações de um time
3. **Entrar com Código Único** → Jogadora entra no time
4. **Verificar Status da Jogadora** → Deve retornar `emTime: true`

### **Passo 4: Testes de Validação**
1. **Testar Quantidade Ímpar** → Deve retornar erro 400
2. **Testar Código Inválido** → Deve retornar erro 404

## 🔧 Testes Manuais (Alternativa)

Se preferir testar manualmente, use estas URLs no Postman:

### **Base URL**: `http://localhost:3000/api`

### **1. Registrar Admin**
```http
POST /auth/register
{
  "name": "Admin",
  "email": "admin@passabola.com",
  "senha": "admin123",
  "isAdmin": true
}
```

### **2. Login Admin**
```http
POST /auth/login
{
  "email": "admin@passabola.com",
  "senha": "admin123"
}
```

### **3. Registrar Jogadora**
```http
POST /jogadoras/register
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

### **4. Login Jogadora**
```http
POST /jogadoras/login
{
  "cpf": "12345678901",
  "senhaJogadora": "jogadora123"
}
```

### **5. Listar Jogadoras Pendentes (Admin)**
```http
GET /jogadoras/listar?aprovada=false
Authorization: Bearer <admin_token>
```

### **6. Aprovar Jogadora (Admin)**
```http
PUT /jogadoras/aprovar/<jogadora_id>
Authorization: Bearer <admin_token>
```

### **7. Criar Times (Admin)**
```http
POST /times/criar
Authorization: Bearer <admin_token>
{
  "quantidade": 8,
  "capacidade": 11
}
```

### **8. Verificar Status da Jogadora**
```http
GET /times/meu-status
Authorization: Bearer <jogadora_token>
```

### **9. Entrar com Código Único**
```http
POST /times/entrar-codigo
Authorization: Bearer <jogadora_token>
{
  "codigo": "ABC123"
}
```

## ✅ Respostas Esperadas

### **Times Criados com Sucesso**
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

### **Jogadora Alocada**
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

### **Status da Jogadora (em time)**
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

## 🚨 Códigos de Erro

- **400**: Dados inválidos ou regras violadas
- **401**: Token inválido ou ausente
- **403**: Acesso negado (não é admin/jogadora)
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## 💡 Dicas Importantes

1. **Sempre use tokens** nas requisições autenticadas
2. **Aprove jogadoras** antes de testar entrada em times
3. **Use variáveis** no Postman para facilitar
4. **Teste cenários de erro** para validar
5. **Verifique status** antes e depois de cada operação

## 🔄 Limpeza para Novos Testes

Para limpar e começar novos testes:

```http
DELETE /times/deletar-todos
Authorization: Bearer <admin_token>
```

Isso remove todos os times e limpa as referências das jogadoras.

---

**🎯 Resultado**: Sistema completamente testado e funcionando!
