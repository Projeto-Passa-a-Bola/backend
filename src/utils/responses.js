function successResponse(res, statusCode, message, data = null) {
  const response = { msg: message };
  if (data) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
}

function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ msg: message });
}

module.exports = {
  successResponse,
  errorResponse
};