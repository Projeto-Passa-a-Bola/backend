# Sistema de Times - Passa Bola

## Visão Geral

O sistema de times permite que jogadoras se inscrevam em times através de duas formas:
1. **Entrada com Código Único**: Jogadora recebe um código e o insere no sistema
2. **Entrada em Time Aleatório**: Sistema aloca automaticamente a jogadora em um time com vaga

## Funcionalidades Implementadas

### Para Administradores

#### 1. Criar Times
```http
POST /api/times/criar
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "quantidade": 8,
  "capacidade": 11
}
```

**Regras:**
- Quantidade deve ser par (4, 8, 16, 32)
- Mínimo: 4 times, Máximo: 32 times
- Capacidade padrão: 11 jogadoras por time
- Sistema gera códigos únicos automaticamente (formato: ABC123)
- Times são organizados em grupos (A, B, C, D, etc.)

#### 2. Listar Times
```http
GET /api/times/listar
Authorization: Bearer <admin_token>
```

Retorna todos os times com informações detalhadas:
- Nome do time
- Código único
- Grupo
- Capacidade e vagas restantes
- Lista de jogadoras

#### 3. Estatísticas
```http
GET /api/times/estatisticas
Authorization: Bearer <admin_token>
```

Retorna estatísticas gerais:
- Total de times
- Total de jogadoras alocadas
- Times com vagas disponíveis
- Distribuição por grupos

#### 4. Deletar Todos os Times
```http
DELETE /api/times/deletar-todos
Authorization: Bearer <admin_token>
```

Remove todos os times e limpa as referências das jogadoras.

### Para Jogadoras

#### 1. Verificar Status
```http
GET /api/times/meu-status
Authorization: Bearer <jogadora_token>
```

Verifica se a jogadora já está em um time.

#### 2. Buscar Time por Código
```http
GET /api/times/buscar/ABC123
```

Busca informações de um time pelo código (não requer autenticação).

#### 3. Entrar com Código
```http
POST /api/times/entrar-codigo
Authorization: Bearer <jogadora_token>
Content-Type: application/json

{
  "codigo": "ABC123"
}
```

Jogadora entra em um time específico usando o código.

#### 4. Entrar em Time Aleatório
```http
POST /api/times/entrar-aleatorio
Authorization: Bearer <jogadora_token>
```

Sistema aloca automaticamente a jogadora no time com menos jogadoras.

## Regras de Negócio

### Validações
- Uma jogadora só pode estar em um time por vez
- Times têm capacidade máxima configurável
- Códigos únicos são gerados automaticamente
- Sistema garante distribuição equilibrada em times aleatórios

### Grupos
- Times são organizados em grupos (A, B, C, D, E, F, G, H)
- Distribuição automática baseada na quantidade de times
- Máximo de 8 grupos

### Códigos Únicos
- Formato: 3 letras + 3 números (ex: ABC123)
- Gerados automaticamente
- Únicos no sistema
- Case-insensitive (sempre convertidos para maiúsculo)

## Fluxo de Uso

### Para Administradores
1. Fazer login como admin
2. Criar times com quantidade desejada
3. Compartilhar códigos com jogadoras
4. Monitorar estatísticas e vagas

### Para Jogadoras
1. Fazer login como jogadora aprovada
2. Verificar se já está em um time
3. Escolher uma das opções:
   - Inserir código único (se tiver)
   - Entrar em time aleatório
4. Receber confirmação e informações do time

## Exemplos de Resposta

### Time Criado com Sucesso
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

### Jogadora Alocada
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

### Status da Jogadora
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

## Códigos de Erro Comuns

- `400`: Dados inválidos ou regras de negócio violadas
- `401`: Token de autenticação inválido ou ausente
- `403`: Acesso negado (não é admin/jogadora ou jogadora não aprovada)
- `404`: Time ou jogadora não encontrada
- `500`: Erro interno do servidor

## Notas Técnicas

- Sistema usa MongoDB com Mongoose
- Autenticação via JWT
- Middleware de validação para admin e jogadoras
- Virtual fields para cálculos dinâmicos
- Índices para performance otimizada
