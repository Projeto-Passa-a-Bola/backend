const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responses');

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 401, 'Acesso negado!');
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    return errorResponse(res, 400, 'Token inválido!');
  }
}

module.exports = checkToken;