# ⚽ Passa a Bola: Backend API

Este é o repositório do backend da plataforma **Passa a Bola**. Esta API RESTful é responsável por gerenciar a lógica de negócios, a autenticação de usuários e a persistência de dados para o frontend.

### 👥 Grupo de Desenvolvimento (Grupo Insight)

Este projeto foi desenvolvido por:

* **Bruno Scuciato** - RM: 562159
* **João Basta** - RM: 565383
* **Kelwin Silva** - RM: 566348
* **Luiz Balbino** - RM: 566222
* **Pedro Almeida** - RM: 564711

---

### 🚀 Tecnologias Utilizadas

O backend foi desenvolvido com um conjunto de tecnologias robusto e escalável:

* **Node.js**: Ambiente de execução JavaScript no servidor.
* **Express**: Framework web para Node.js, usado para construir a API.
* **MongoDB**: Banco de dados NoSQL para armazenar os dados do aplicativo.
* **Mongoose**: Biblioteca de modelagem de objetos para MongoDB.
* **JWT (JSON Web Tokens)**: Para autenticação segura de usuários.
* **bcrypt**: Para criptografia de senhas.

---

### 🛠️ Configuração e Instalação

Siga os passos abaixo para configurar o backend em seu ambiente de desenvolvimento.

#### Pré-requisitos

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* [MongoDB](https://www.mongodb.com/try/download/community) (instale e certifique-se de que o servidor do MongoDB está rodando).

#### Passo a Passo

1.  Clone o repositório do backend:

    ```bash
    git clone https://github.com/Projeto-Passa-a-Bola/backend
    cd backend
    ```

2.  Instale as dependências:

    ```bash
    npm install
    # ou
    yarn
    ```

3.  Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias, como a string de conexão do banco de dados e a chave secreta para JWT.

    ```
    # Exemplo de .env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/passabola
    JWT_SECRET=sua_chave_secreta_aqui
    ```

4.  Inicie o servidor:

    ```bash
    npm start
    # ou
    yarn start
    ```

O servidor da API estará rodando em `http://localhost:3000` (ou na porta que você configurou no `.env`).

---

### 📂 Estrutura da API (Endpoints)

A API segue uma arquitetura RESTful. Aqui estão alguns dos principais endpoints:

* `POST /api/auth/register`: Registra um novo usuário.
* `POST /api/auth/login`: Autentica um usuário e retorna um JWT.
* `GET /api/players`: Retorna uma lista de todas as jogadoras cadastradas.
* `GET /api/players/:id`: Retorna informações de uma jogadora específica.
* `PUT /api/players/:id`: Atualiza as informações de uma jogadora.

---

