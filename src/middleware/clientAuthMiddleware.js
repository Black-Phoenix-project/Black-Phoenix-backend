const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const protectClient = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован. Требуется токен доступа.',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Недействительный или истёкший токен доступа.',
      });
    }

    if (!decoded || decoded.type !== 'client') {
      return res.status(401).json({
        success: false,
        message: 'Токен не является клиентским.',
      });
    }

    const client = await Client.findById(decoded.id);

    if (!client) {
      return res.status(401).json({
        success: false,
        message: 'Клиент не найден.',
      });
    }

    req.clientId = client._id.toString();
    next();
  } catch (error) {
    console.error('Client auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка авторизации.',
    });
  }
};

module.exports = protectClient;
