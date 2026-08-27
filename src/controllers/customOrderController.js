const CustomOrder = require('../models/CustomOrder');
const errorResponse = require('../utils/errorResponse');

exports.createCustomOrder = async (req, res) => {
  try {
    const { name, phone, email, category, requirements } = req.body;
    if (!name || !phone || !requirements) {
      return res.status(400).json({ success: false, message: 'Укажите имя, телефон и требования' });
    }
    const order = await CustomOrder.create({ name, phone, email, category, requirements });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.getAllCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.updateCustomOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Не найдено' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.deleteCustomOrder = async (req, res) => {
  try {
    const order = await CustomOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Не найдено' });
    res.status(200).json({ success: true, message: 'Успешно удалено' });
  } catch (error) {
    errorResponse(res, error);
  }
};
