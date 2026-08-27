const errorResponse = (res, error, context = '') => {
  if (context) {
    console.error(`${context}:`, error);
  } else {
    console.error('Error:', error);
  }

  const message = error && error.message ? error.message : 'Внутренняя ошибка сервера';
  const status = error && error.statusCode ? error.statusCode : 500;
  return res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorResponse;
