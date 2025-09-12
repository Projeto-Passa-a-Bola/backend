const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responses');

const UserController = {
  async getUserById(req, res) {
    try {
      const id = req.params.id;
      
      // Verificar se usuário existe
      const user = await User.findById(id, '-senha');
      if (!user) {
        return errorResponse(res, 404, 'Usuário não encontrado');
      }

      return successResponse(res, 200, 'Usuário encontrado', { user });
    } catch (error) {
      console.error(error);
      return errorResponse(res, 500, 'Erro ao buscar usuário');
    }
  }
};

module.exports = UserController;