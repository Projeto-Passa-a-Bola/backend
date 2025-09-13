# Exemplo de Uso do Sistema de Times - Passa Bola

Este documento mostra como usar o sistema de times implementado no Passa Bola.

## 🚀 Fluxo Completo de Uso

### 1. Configuração Inicial (Admin)

#### 1.1 Criar um usuário admin
```bash
# Primeiro, você precisa ter um usuário com isAdmin: true no banco
# Isso pode ser feito diretamente no MongoDB ou criando um script
```

#### 1.2 Login como admin
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@passabola.com",
  "senha": "123456"
}
```

#### 1.3 Criar times
```http
POST http://localhost:3000/api/times/admin/criar
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "quantidade": 8,
  "capacidade": 11
}
```

**Resposta:**
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
    },
    {
      "id": "64f7b8c9d1234567890abcdf",
      "nome": "Time A2",
      "codigoUnico": "DEF456",
      "grupo": "A",
      "capacidade": 11
    }
    // ... mais times
  ]
}
```

### 2. Fluxo da Jogadora

#### 2.1 Login da jogadora
```http
POST http://localhost:3000/api/jogadoras/login
Content-Type: application/json

{
  "cpf": "12345678901",
  "senhaJogadora": "senha123"
}
```

#### 2.2 Verificar status da jogadora
```http
GET http://localhost:3000/api/times/jogadora/status
Authorization: Bearer <jogadora_token>
```

**Resposta (não está em time):**
```json
{
  "emTime": false,
  "msg": "Você não está em nenhum time ainda"
}
```

#### 2.3 Opção 1: Entrar com código único
```http
POST http://localhost:3000/api/times/jogadora/entrar-codigo
Authorization: Bearer <jogadora_token>
Content-Type: application/json

{
  "codigo": "ABC123"
}
```

**Resposta:**
```json
{
  "msg": "Você foi adicionada ao time com sucesso!",
  "time": {
    "id": "64f7b8c9d1234567890abcde",
    "nome": "Time A1",
    "codigoUnico": "ABC123",
    "grupo": "A",
    "capacidade": 11,
    "jogadorasAtuais": 1
  }
}
```

#### 2.4 Opção 2: Entrar em time aleatório
```http
POST http://localhost:3000/api/times/jogadora/entrar-aleatorio
Authorization: Bearer <jogadora_token>
```

**Resposta:**
```json
{
  "msg": "Você foi alocada em um time aleatório com sucesso!",
  "time": {
    "id": "64f7b8c9d1234567890abcdf",
    "nome": "Time B1",
    "codigoUnico": "GHI789",
    "grupo": "B",
    "capacidade": 11,
    "jogadorasAtuais": 2
  }
}
```

### 3. Monitoramento (Admin)

#### 3.1 Listar todos os times
```http
GET http://localhost:3000/api/times/admin/listar
Authorization: Bearer <admin_token>
```

#### 3.2 Ver estatísticas
```http
GET http://localhost:3000/api/times/admin/estatisticas
Authorization: Bearer <admin_token>
```

**Resposta:**
```json
{
  "estatisticas": {
    "totalTimes": 8,
    "totalJogadoras": 15,
    "timesComVaga": 6,
    "distribuicaoGrupos": [
      {
        "_id": "A",
        "totalTimes": 1,
        "totalJogadoras": 5,
        "capacidadeTotal": 11
      },
      {
        "_id": "B",
        "totalTimes": 1,
        "totalJogadoras": 3,
        "capacidadeTotal": 11
      }
    ]
  }
}
```

## 🔧 Funcionalidades Implementadas

### ✅ Recursos Principais
- [x] Criação de times com códigos únicos
- [x] Validação de número par de times
- [x] Sistema de grupos automático
- [x] Entrada com código único
- [x] Entrada em time aleatório
- [x] Alocação inteligente (menos jogadoras primeiro)
- [x] Verificação de status da jogadora
- [x] Estatísticas para admin
- [x] Validações completas

### ✅ Regras Implementadas
- [x] Quantidade limitada e par de times
- [x] Uma jogadora por time
- [x] Capacidade máxima por time
- [x] Sistema de grupos (A, B, C, D, etc.)
- [x] Códigos únicos de 6 caracteres
- [x] Jogadora deve estar aprovada
- [x] Proteção de rotas admin

### ✅ Validações
- [x] Formato de código (ABC123)
- [x] Número par de times
- [x] Capacidade entre 1-20
- [x] Jogadora não pode estar em dois times
- [x] Time não pode estar lotado
- [x] Autenticação e autorização

## 🎯 Próximos Passos Sugeridos

1. **Interface de Admin**: Criar painel para gerenciar times
2. **Notificações**: Sistema de notificações para jogadoras
3. **Histórico**: Log de movimentações entre times
4. **Relatórios**: Relatórios detalhados de ocupação
5. **API de Códigos**: Endpoint para gerar códigos individuais
6. **Sorteio**: Sistema de sorteio de times
7. **Campeonato**: Integração com sistema de campeonatos

## 🚨 Pontos de Atenção

1. **Admin Setup**: Certifique-se de ter um usuário com `isAdmin: true`
2. **Aprovação**: Jogadoras devem estar aprovadas para entrar em times
3. **Códigos**: Códigos são gerados automaticamente e são únicos
4. **Limpeza**: Use a rota de deletar todos os times para resetar
5. **Backup**: Faça backup antes de deletar times em produção

## 📱 Exemplo de Frontend

```javascript
// Verificar status da jogadora
const verificarStatus = async () => {
  const response = await fetch('/api/times/jogadora/status', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  
  if (data.emTime) {
    console.log(`Você está no time: ${data.time.nome}`);
  } else {
    console.log('Você não está em nenhum time');
  }
};

// Entrar com código
const entrarComCodigo = async (codigo) => {
  const response = await fetch('/api/times/jogadora/entrar-codigo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ codigo })
  });
  
  const data = await response.json();
  console.log(data.msg);
};
```

O sistema está pronto para uso! 🎉
