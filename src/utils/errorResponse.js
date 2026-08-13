const errorResponse = (res, error, context = '') => {
  if (context) {
    console.error(`${context}:`, error);
  } else {
    console.error('Error:', error);
  }

  return res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
  });
};

module.exports = errorResponse;
