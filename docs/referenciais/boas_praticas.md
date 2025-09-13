# 📚 Boas Práticas de Programação - Passa Bola

## 📋 Índice

1. [Princípios Fundamentais](#-princípios-fundamentais)
2. [Estrutura de Código](#-estrutura-de-código)
3. [Nomenclatura](#-nomenclatura)
4. [Tratamento de Erros](#-tratamento-de-erros)
5. [Segurança](#-segurança)
6. [Performance](#-performance)
7. [Documentação](#-documentação)
8. [Testes](#-testes)
9. [Versionamento](#-versionamento)
10. [Deploy](#-deploy)

---

## 🎯 Princípios Fundamentais

### **SOLID Principles**

#### **S - Single Responsibility Principle (SRP)**
Cada classe/função deve ter apenas uma responsabilidade.

```javascript
// ❌ Ruim - Múltiplas responsabilidades
class UserController {
  async createUser(req, res) {
    // Validação
    if (!req.body.email) return res.status(400).json({msg: 'Email obrigatório'});
    
    // Criptografia
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(req.body.senha, salt);
    
    // Criação no banco
    const user = new User({...req.body, senha: hash});
    await user.save();
    
    // Resposta
    res.status(201).json({msg: 'Usuário criado'});
  }
}

// ✅ Bom - Responsabilidades separadas
class UserController {
  async createUser(req, res) {
    try {
      const userData = await this.userService.createUser(req.body);
      res.status(201).json({msg: 'Usuário criado', user: userData});
    } catch (error) {
      res.status(400).json({msg: error.message});
    }
  }
}

class UserService {
  async createUser(userData) {
    this.validateUserData(userData);
    const hashedPassword = await this.hashPassword(userData.senha);
    return await this.userRepository.create({...userData, senha: hashedPassword});
  }
}
```

#### **O - Open/Closed Principle (OCP)**
Aberto para extensão, fechado para modificação.

```javascript
// ✅ Bom - Extensível sem modificar código existente
class PaymentProcessor {
  process(payment) {
    return this.strategy.process(payment);
  }
}

class CreditCardStrategy {
  process(payment) {
    // Lógica específica para cartão de crédito
  }
}

class PixStrategy {
  process(payment) {
    // Lógica específica para PIX
  }
}
```

#### **L - Liskov Substitution Principle (LSP)**
Objetos derivados devem ser substituíveis por objetos base.

```javascript
// ✅ Bom - JogadoraCadastrada pode substituir User
class User {
  canAccess() {
    return this.isActive;
  }
}

class JogadoraCadastrada extends User {
  canAccess() {
    return this.isActive && this.aprovada;
  }
}
```

#### **I - Interface Segregation Principle (ISP)**
Clientes não devem depender de interfaces que não usam.

```javascript
// ❌ Ruim - Interface muito grande
class UserInterface {
  createUser() {}
  updateUser() {}
  deleteUser() {}
  sendEmail() {}
  generateReport() {}
}

// ✅ Bom - Interfaces específicas
class UserCRUD {
  create() {}
  update() {}
  delete() {}
}

class UserNotification {
  sendEmail() {}
}
```

#### **D - Dependency Inversion Principle (DIP)**
Dependa de abstrações, não de implementações concretas.

```javascript
// ❌ Ruim - Dependência direta
class UserController {
  constructor() {
    this.userRepository = new MongoDBUserRepository();
  }
}

// ✅ Bom - Dependência de abstração
class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
}
```

---

## 🏗️ Estrutura de Código

### **Organização de Arquivos**

```
src/
├── controllers/          # Lógica de negócio
│   ├── authController.js
│   ├── userController.js
│   └── timeController.js
├── services/            # Serviços de domínio
│   ├── authService.js
│   ├── userService.js
│   └── timeService.js
├── repositories/        # Acesso a dados
│   ├── userRepository.js
│   └── timeRepository.js
├── models/             # Modelos de dados
│   ├── User.js
│   └── Time.js
├── middlewares/        # Middlewares
│   ├── auth.js
│   └── validation.js
├── routes/            # Rotas
│   ├── authRoutes.js
│   └── timeRoutes.js
├── utils/             # Utilitários
│   ├── validators.js
│   └── helpers.js
└── config/            # Configurações
    ├── database.js
    └── app.js
```

### **Padrão de Controller**

```javascript
class TimeController {
  constructor(timeService) {
    this.timeService = timeService;
  }

  async criarTimes(req, res) {
    try {
      const { quantidade, capacidade } = req.body;
      const adminId = req.userId;

      const times = await this.timeService.criarTimes(quantidade, capacidade, adminId);
      
      res.status(201).json({
        msg: `${quantidade} times criados com sucesso!`,
        times: times.map(time => this.formatTimeResponse(time))
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  formatTimeResponse(time) {
    return {
      id: time._id,
      nome: time.nome,
      codigoUnico: time.codigoUnico,
      grupo: time.grupo,
      capacidade: time.capacidade
    };
  }

  handleError(res, error) {
    console.error('Erro no controller:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    
    res.status(500).json({ msg: 'Erro interno do servidor' });
  }
}
```

### **Padrão de Service**

```javascript
class TimeService {
  constructor(timeRepository, codigoGenerator) {
    this.timeRepository = timeRepository;
    this.codigoGenerator = codigoGenerator;
  }

  async criarTimes(quantidade, capacidade, adminId) {
    this.validarQuantidadeTimes(quantidade);
    
    const timesExistentes = await this.timeRepository.countAtivos();
    if (timesExistentes > 0) {
      throw new Error('Já existem times ativos. Delete os existentes antes de criar novos.');
    }

    const grupos = this.gerarGrupos(quantidade);
    const times = [];

    for (let i = 0; i < quantidade; i++) {
      const codigoUnico = await this.codigoGenerator.gerar();
      const time = {
        nome: `Time ${String.fromCharCode(65 + i)}${i + 1}`,
        codigoUnico,
        grupo: grupos[i],
        capacidade,
        criadoPor: adminId
      };
      times.push(time);
    }

    return await this.timeRepository.createMany(times);
  }

  validarQuantidadeTimes(quantidade) {
    if (quantidade % 2 !== 0) {
      throw new Error('A quantidade de times deve ser um número par');
    }
    if (quantidade < 4 || quantidade > 32) {
      throw new Error('A quantidade deve estar entre 4 e 32');
    }
  }

  gerarGrupos(quantidade) {
    const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const timesPorGrupo = quantidade / 8;
    
    return Array.from({ length: quantidade }, (_, i) => 
      grupos[Math.floor(i / timesPorGrupo)]
    );
  }
}
```

---

## 📝 Nomenclatura

### **Variáveis e Funções**

```javascript
// ✅ Bom - Descritivo e claro
const jogadorasAprovadas = await Jogadora.find({ aprovada: true });
const tempoExpiracaoToken = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

// ❌ Ruim - Abreviado e confuso
const jogAprov = await Jogadora.find({ aprov: true });
const tempExp = 7 * 24 * 60 * 60 * 1000;

// ✅ Bom - Verbos para funções
async function validarDadosJogadora(dados) {}
async function calcularVagasRestantes(time) {}
async function gerarCodigoUnico() {}

// ❌ Ruim - Substantivos para funções
async function validacao(dados) {}
async function calculo(time) {}
async function codigo() {}
```

### **Classes e Objetos**

```javascript
// ✅ Bom - PascalCase para classes
class TimeController {}
class JogadoraService {}
class CodigoGenerator {}

// ✅ Bom - camelCase para instâncias
const timeController = new TimeController();
const jogadoraService = new JogadoraService();

// ✅ Bom - UPPER_CASE para constantes
const MAX_CAPACIDADE_TIME = 20;
const MIN_QUANTIDADE_TIMES = 4;
const SECRET_KEY = process.env.SECRET;
```

### **Arquivos e Diretórios**

```javascript
// ✅ Bom - kebab-case para arquivos
time-controller.js
jogadora-service.js
codigo-generator.js

// ✅ Bom - camelCase para diretórios
src/controllers/
src/services/
src/repositories/
```

---

## ⚠️ Tratamento de Erros

### **Estratégia de Tratamento**

```javascript
// ✅ Bom - Tratamento centralizado
class ErrorHandler {
  static handle(error, req, res, next) {
    console.error('Erro capturado:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        msg: 'Dados inválidos',
        errors: this.formatValidationErrors(error)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        msg: 'ID inválido'
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        msg: 'Dados duplicados',
        field: this.getDuplicateField(error)
      });
    }

    res.status(500).json({
      msg: 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  static formatValidationErrors(error) {
    return Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
  }
}
```

### **Erros Customizados**

```javascript
// ✅ Bom - Erros específicos do domínio
class TimeLotadoError extends Error {
  constructor(timeNome) {
    super(`O time ${timeNome} está lotado`);
    this.name = 'TimeLotadoError';
    this.statusCode = 400;
  }
}

class JogadoraJaEmTimeError extends Error {
  constructor() {
    super('Jogadora já está em um time');
    this.name = 'JogadoraJaEmTimeError';
    this.statusCode = 400;
  }
}

// Uso
if (time.jogadorasAtuais >= time.capacidade) {
  throw new TimeLotadoError(time.nome);
}
```

### **Validação de Dados**

```javascript
// ✅ Bom - Validação robusta
class JogadoraValidator {
  static validateRegistration(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!this.isValidCPF(data.cpf)) {
      errors.push('CPF inválido');
    }

    if (!this.isValidPhone(data.telefone)) {
      errors.push('Telefone inválido');
    }

    if (!this.isValidPosition(data.posicao)) {
      errors.push('Posição inválida');
    }

    if (errors.length > 0) {
      throw new ValidationError('Dados inválidos', errors);
    }
  }

  static isValidCPF(cpf) {
    // Lógica de validação de CPF
    return /^\d{11}$/.test(cpf.replace(/\D/g, ''));
  }

  static isValidPhone(phone) {
    return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone);
  }

  static isValidPosition(position) {
    const validPositions = ['Goleira', 'Zagueira', 'Lateral', 'Meio-campo', 'Atacante'];
    return validPositions.includes(position);
  }
}
```

---

## 🔒 Segurança

### **Autenticação e Autorização**

```javascript
// ✅ Bom - Middleware de autenticação robusto
class AuthMiddleware {
  static async verificarToken(req, res, next) {
    try {
      const token = this.extractToken(req);
      if (!token) {
        return res.status(401).json({ msg: 'Token não fornecido' });
      }

      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await this.findUser(decoded);
      
      if (!user) {
        return res.status(401).json({ msg: 'Token inválido' });
      }

      req.user = user;
      req.userType = decoded.type;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token expirado' });
      }
      return res.status(401).json({ msg: 'Token inválido' });
    }
  }

  static extractToken(req) {
    const authHeader = req.headers.authorization;
    return authHeader && authHeader.split(' ')[1];
  }
}
```

### **Sanitização de Dados**

```javascript
// ✅ Bom - Sanitização de entrada
class DataSanitizer {
  static sanitizeUserInput(data) {
    const sanitized = {};

    if (data.name) {
      sanitized.name = data.name.trim().replace(/[<>]/g, '');
    }

    if (data.email) {
      sanitized.email = data.email.toLowerCase().trim();
    }

    if (data.cpf) {
      sanitized.cpf = data.cpf.replace(/\D/g, '');
    }

    return sanitized;
  }

  static sanitizeTimeCode(code) {
    return code.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
  }
}
```

### **Rate Limiting**

```javascript
// ✅ Bom - Controle de taxa de requisições
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: {
    msg: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/auth/login', loginLimiter);
```

---

## ⚡ Performance

### **Otimização de Queries**

```javascript
// ❌ Ruim - Query ineficiente
const times = await Time.find({})
  .populate('jogadoras')
  .populate('criadoPor');

// ✅ Bom - Query otimizada
const times = await Time.find({ ativo: true })
  .populate('jogadoras', 'name lastName posicao')
  .populate('criadoPor', 'name email')
  .select('nome codigoUnico grupo capacidade jogadoras criadoPor')
  .lean(); // Retorna objetos JavaScript simples
```

### **Cache**

```javascript
// ✅ Bom - Cache de dados frequentes
class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutos
  }

  async get(key, fetchFunction) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  clear() {
    this.cache.clear();
  }
}

// Uso
const cacheService = new CacheService();

async function getTimes() {
  return await cacheService.get('times', async () => {
    return await Time.find({ ativo: true }).lean();
  });
}
```

### **Paginação**

```javascript
// ✅ Bom - Paginação eficiente
class PaginationService {
  static async paginate(model, query, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      select = null
    } = options;

    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      model.find(query)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      model.countDocuments(query)
    ]);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }
}
```

---

## 📖 Documentação

### **JSDoc**

```javascript
/**
 * Cria múltiplos times no sistema
 * @param {Object} req - Objeto de requisição
 * @param {Object} req.body - Dados da requisição
 * @param {number} req.body.quantidade - Quantidade de times a criar (deve ser par)
 * @param {number} [req.body.capacidade=11] - Capacidade de cada time
 * @param {string} req.userId - ID do administrador que está criando
 * @param {Object} res - Objeto de resposta
 * @returns {Promise<void>}
 * @throws {ValidationError} Quando quantidade não é par
 * @throws {ConflictError} Quando já existem times ativos
 * @example
 * // Criar 8 times com capacidade padrão
 * POST /api/times/criar
 * {
 *   "quantidade": 8
 * }
 */
async function criarTimes(req, res) {
  // Implementação...
}
```

### **README Detalhado**

```markdown
# Passa Bola API

## Instalação

```bash
npm install
npm run dev
```

## Uso

### Criar Times

```javascript
const response = await fetch('/api/times/criar', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quantidade: 8,
    capacidade: 11
  })
});
```

## API Reference

Veja [API_TECHNICAL.md](./API_TECHNICAL.md) para documentação completa.
```

---

## 🧪 Testes

### **Estrutura de Testes**

```javascript
// ✅ Bom - Testes organizados
describe('TimeController', () => {
  let timeService;
  let timeController;

  beforeEach(() => {
    timeService = {
      criarTimes: jest.fn(),
      listarTimes: jest.fn()
    };
    timeController = new TimeController(timeService);
  });

  describe('criarTimes', () => {
    it('deve criar times com sucesso', async () => {
      // Arrange
      const mockTimes = [
        { _id: '1', nome: 'Time A1', codigoUnico: 'ABC123' }
      ];
      timeService.criarTimes.mockResolvedValue(mockTimes);

      const req = {
        body: { quantidade: 8, capacidade: 11 },
        userId: 'admin123'
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Act
      await timeController.criarTimes(req, res);

      // Assert
      expect(timeService.criarTimes).toHaveBeenCalledWith(8, 11, 'admin123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: '8 times criados com sucesso!',
        times: expect.any(Array)
      });
    });

    it('deve retornar erro quando quantidade é ímpar', async () => {
      // Arrange
      timeService.criarTimes.mockRejectedValue(
        new Error('A quantidade de times deve ser um número par')
      );

      const req = {
        body: { quantidade: 7 },
        userId: 'admin123'
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Act
      await timeController.criarTimes(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'A quantidade de times deve ser um número par'
      });
    });
  });
});
```

### **Testes de Integração**

```javascript
// ✅ Bom - Testes de integração
describe('POST /api/times/criar', () => {
  let adminToken;

  beforeAll(async () => {
    // Criar admin e obter token
    const admin = await User.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      senha: await bcrypt.hash('admin123', 12),
      isAdmin: true
    });

    adminToken = jwt.sign(
      { id: admin._id, type: 'user' },
      process.env.SECRET
    );
  });

  it('deve criar times com sucesso', async () => {
    const response = await request(app)
      .post('/api/times/criar')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        quantidade: 8,
        capacidade: 11
      })
      .expect(201);

    expect(response.body.msg).toBe('8 times criados com sucesso!');
    expect(response.body.times).toHaveLength(8);
  });
});
```

---

## 📦 Versionamento

### **Semantic Versioning**

```json
{
  "version": "1.2.3"
}
```

- **MAJOR (1)**: Mudanças incompatíveis
- **MINOR (2)**: Novas funcionalidades compatíveis
- **PATCH (3)**: Correções de bugs

### **Changelog**

```markdown
# Changelog

## [1.2.3] - 2024-01-15

### Fixed
- Corrigido bug na validação de CPF
- Corrigido erro 500 ao criar times

## [1.2.2] - 2024-01-10

### Added
- Sistema de cache para listagem de times
- Validação de rate limiting

### Changed
- Melhorada performance das queries de times
```

---

## 🚀 Deploy

### **Ambientes**

```javascript
// ✅ Bom - Configuração por ambiente
const config = {
  development: {
    port: 3000,
    database: 'mongodb://localhost:27017/passabola-dev',
    secret: 'dev-secret-key'
  },
  production: {
    port: process.env.PORT || 3000,
    database: process.env.MONGODB_URI,
    secret: process.env.SECRET
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

### **Docker**

```dockerfile
# ✅ Bom - Dockerfile otimizado
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

### **CI/CD**

```yaml
# ✅ Bom - GitHub Actions
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Run linting
      run: npm run lint
```

---

## 📊 Monitoramento

### **Logs Estruturados**

```javascript
// ✅ Bom - Logs estruturados
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Uso
logger.info('Time criado', {
  timeId: time._id,
  adminId: req.userId,
  quantidade: req.body.quantidade
});
```

### **Métricas**

```javascript
// ✅ Bom - Coleta de métricas
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware para coletar métricas
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
});
```

---

**🎯 Seguindo essas boas práticas, o código do Passa Bola será mais maintível, seguro e escalável! 🚀**
