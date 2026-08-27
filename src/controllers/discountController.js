const Discount = require('../models/Discount');
const errorResponse = require('../utils/errorResponse');

exports.getAllDiscounts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active === 'true') filter.active = true;
    const discounts = await Discount.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: discounts.length, data: discounts });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.createDiscount = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.product) delete body.product;
    if (!body.startsAt) delete body.startsAt;
    if (!body.endsAt) delete body.endsAt;
    const discount = await Discount.create(body);
    res.status(201).json({ success: true, data: discount });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.product) delete body.product;
    if (!body.startsAt) delete body.startsAt;
    if (!body.endsAt) delete body.endsAt;
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!discount) return res.status(404).json({ success: false, message: 'Не найдено' });
    res.status(200).json({ success: true, data: discount });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ success: false, message: 'Не найдено' });
    res.status(200).json({ success: true, message: 'Успешно удалено' });
  } catch (error) {
    errorResponse(res, error);
  }
};
