const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responses');

const AuthController = {
  async register(req, res) {
    try {
      const { name, email, senha, confirmasenha } = req.body;

      // Validações
      if (!name) {
        return errorResponse(res, 422, 'O nome é obrigatório');
      }
      if (!email) {
        return errorResponse(res, 422, 'O email é obrigatório');
      }
      if (!senha) {
        return errorResponse(res, 422, 'A senha é obrigatória');
      }
      if (senha !== confirmasenha) {
        return errorResponse(res, 422, 'As senhas não conferem');
      }

      // Verificar se usuário existe
      const userExistente = await User.findOne({ email });
      if (userExistente) {
        return errorResponse(res, 422, 'Por favor, utilize outro e-mail!');
      }

      // Criar hash da senha
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(senha, salt);

      // Criar usuário
      const user = new User({
        name,
        email,
        senha: passwordHash,
      });

      await user.save();
      
      return successResponse(res, 201, 'Usuário criado com sucesso!');
    } catch (error) {
      console.error(error);
      return errorResponse(res, 500, 'Aconteceu um erro no servidor, tente novamente mais tarde!');
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Validações
      if (!email) {
        return errorResponse(res, 422, 'O email é obrigatório');
      }
      if (!senha) {
        return errorResponse(res, 422, 'A senha é obrigatória');
      }

      // Verificar se usuário existe
      const user = await User.findOne({ email });
      if (!user) {
        return errorResponse(res, 404, 'Usuário não encontrado!');
      }

      // Verificar senha
      const checkPassword = await bcrypt.compare(senha, user.senha);
      if (!checkPassword) {
        return errorResponse(res, 422, 'Senha inválida!');
      }

      // Gerar token
      const secret = process.env.SECRET;
      const token = jwt.sign(
        { id: user._id },
        secret
      );

      return successResponse(res, 200, 'Autenticação realizada com sucesso', { token });
    } catch (error) {
      console.error(error);
      return errorResponse(res, 500, 'Aconteceu um erro no servidor, tente novamente mais tarde!');
    }
  }
};

module.exports = AuthController;