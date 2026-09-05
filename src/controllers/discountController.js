const Discount = require('../models/Discount');
const errorResponse = require('../utils/errorResponse');

exports.getAllDiscounts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active === 'true') {
      filter.active = true;
      filter.$or = [
        { endsAt: null },
        { endsAt: { $gte: new Date() } },
      ];
    }
    const discounts = await Discount.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: discounts.length, data: discounts });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.createDiscount = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.productId) delete body.productId;
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
    // Remove productId only if it's explicitly empty AND scope is global
    // If scope is product, keep productId (even if empty string) so validator can check it
    if (body.scope === 'global' && (!body.productId || body.productId === '')) {
      // Add $unset to remove productId from the document
      body._unset = { productId: '' };
      // Don't include productId in $set
      delete body.productId;
    } else if (!body.productId) {
      delete body.productId;
    }
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
