const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Не авторизован. Требуется токен доступа.',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: 'Недействительный или истёкший токен доступа.',
      });
    }

    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Пользователь не найден.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      message: 'Ошибка авторизации.',
    });
  }
};

module.exports = protect;
