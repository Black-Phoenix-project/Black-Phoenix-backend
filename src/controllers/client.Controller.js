const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const normalizePhone = (value) => String(value || "").replace(/\D/g, "");

const registerClient = async (req, res) => {
  try {
    const { phoneNumber, password, fullName } = req.body;
    const normalizedPhone = normalizePhone(phoneNumber);

    if (!normalizedPhone || !password) {
      return res.status(400).json({
        message: "Укажите телефон и пароль",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Пароль должен содержать минимум 6 символов",
      });
    }

    const existingClient = await Client.findOne({ phoneNumber: normalizedPhone })
      .lean();
    if (existingClient) {
      return res.status(409).json({
        message: "Клиент с таким номером телефона уже существует",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await Client.create({
      phoneNumber: normalizedPhone,
      password: hashedPassword,
      fullName: fullName ? String(fullName).trim() : "",
    });

    const token = jwt.sign(
      { id: created._id, phoneNumber: created.phoneNumber, type: "client" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(201).json({
      message: "Регистрация клиента прошла успешно",
      token,
      user: {
        id: created._id,
        phoneNumber: created.phoneNumber,
        fullName: created.fullName || null,
        image: created.avatar || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ошибка при регистрации клиента",
    });
  }
};

const loginClient = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const normalizedPhone = normalizePhone(phoneNumber);

    if (!normalizedPhone || !password) {
      return res.status(400).json({
        message: "Укажите телефон и пароль",
      });
    }

    const client = await Client.findOne({ phoneNumber: normalizedPhone });
    if (!client) {
      return res.status(404).json({
        message: "Номер телефона не найден",
      });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Неверный пароль",
      });
    }

    const token = jwt.sign(
      { id: client._id, phoneNumber: client.phoneNumber, type: "client" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({
      message: "Вход клиента выполнен успешно",
      token,
      user: {
        id: client._id,
        phoneNumber: client.phoneNumber,
        fullName: client.fullName || null,
        image: client.avatar || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

module.exports = {
  registerClient,
  loginClient,
};
