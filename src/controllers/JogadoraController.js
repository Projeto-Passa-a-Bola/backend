const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Jogadora = require('../models/Jogadora');
const { successResponse, errorResponse } = require('../utils/responses');

const JogadoraController = {
  async register(req, res) {
    try {
      const { 
        name, 
        lastName, 
        nacionalidade, 
        cpf, 
        senhaJogadora, 
        telefone, 
        dataNascimento, 
        posicao 
      } = req.body;

      // Validações
      if (!name) {
        return errorResponse(res, 422, 'O nome é obrigatório');
      }
      if (!lastName) {
        return errorResponse(res, 422, 'O sobrenome é obrigatório');
      }
      if (!nacionalidade) {
        return errorResponse(res, 422, 'A nacionalidade é obrigatória');
      }
      if (!cpf) {
        return errorResponse(res, 422, 'O CPF é obrigatório');
      }
      if (!senhaJogadora) {
        return errorResponse(res, 422, 'A senha é obrigatória');
      }
      if (!telefone) {
        return errorResponse(res, 422, 'O telefone é obrigatório');
      }
      if (!dataNascimento) {
        return errorResponse(res, 422, 'A data de nascimento é obrigatória');
      }
      if (!posicao) {
        return errorResponse(res, 422, 'A posição é obrigatória');
      }

      // Verificar se jogadora existe
      const jogadoraExistente = await Jogadora.findOne({ cpf });
      if (jogadoraExistente) {
        return errorResponse(res, 422, 'Já existe uma jogadora cadastrada com este CPF!');
      }

      // Criar hash da senha
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(senhaJogadora, salt);

      // Criar jogadora
      const jogadora = new Jogadora({
        name,
        lastName,
        nacionalidade,
        cpf,
        senhaJogadora: passwordHash,
        telefone,
        dataNascimento,
        posicao,
      });

      await jogadora.save();
      
      return successResponse(res, 201, 'Jogadora cadastrada com sucesso!');
    } catch (error) {
      console.error(error);
      return errorResponse(res, 500, 'Aconteceu um erro no servidor, tente novamente mais tarde!');
    }
  },

  async login(req, res) {
    try {
      const { cpf, senhaJogadora } = req.body;

      // Validações
      if (!cpf) {
        return errorResponse(res, 422, 'O CPF é obrigatório');
      }
      if (!senhaJogadora) {
        return errorResponse(res, 422, 'A senha é obrigatória');
      }

      // Verificar se jogadora existe
      const jogadora = await Jogadora.findOne({ cpf });
      if (!jogadora) {
        return errorResponse(res, 404, 'Jogadora não encontrada!');
      }

      // Verificar senha
      const checkPassword = await bcrypt.compare(senhaJogadora, jogadora.senhaJogadora);
      if (!checkPassword) {
        return errorResponse(res, 422, 'Senha inválida!');
      }

      // Gerar token
      const secret = process.env.SECRET;
      const token = jwt.sign(
        { id: jogadora._id },
        secret
      );

      return successResponse(res, 200, 'Autenticação realizada com sucesso', { token });
    } catch (error) {
      console.error(error);
      return errorResponse(res, 500, 'Aconteceu um erro no servidor, tente novamente mais tarde!');
    }
  },

  async getPerfil(req, res) {
    try {
      const id = req.params.id;
      
      console.log('Buscando jogadora com ID:', id);
      
      // Verificar se jogadora existe
      const jogadora = await Jogadora.findById(id, '-senhaJogadora');
      console.log('Jogadora encontrada:', jogadora);
      
      if (!jogadora) {
        return errorResponse(res, 404, 'Jogadora não encontrada');
      }

      return successResponse(res, 200, 'Perfil da jogadora encontrado', { jogadora });
    } catch (error) {
      console.error('Erro ao buscar jogadora:', error);
      return errorResponse(res, 500, 'Erro ao buscar perfil da jogadora');
    }
  },

  async listarJogadoras(req, res) {
    try {
      const jogadoras = await Jogadora.find({}, '-senhaJogadora');
      console.log('Total de jogadoras:', jogadoras.length);
      return successResponse(res, 200, 'Lista de jogadoras', { jogadoras });
    } catch (error) {
      console.error('Erro ao listar jogadoras:', error);
      return errorResponse(res, 500, 'Erro ao listar jogadoras');
    }
  }
};

module.exports = JogadoraController;
