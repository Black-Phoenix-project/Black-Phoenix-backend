const Category = require('../models/Category');
const Product = require('../models/Product');
const errorResponse = require('../utils/errorResponse');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, order, parent, active, productIds } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Укажите название и slug' });
    }
    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Категория с таким slug уже существует' });
    }
    const payload = { name, slug, order, active };
    if (parent) payload.parent = parent;
    const category = await Category.create(payload);
    if (Array.isArray(productIds) && productIds.length) {
      await Product.updateMany({ _id: { $in: productIds } }, { category: slug });
    }
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.parent) delete body.parent;
    if (body.order === "" || body.order == null) delete body.order;
    const productIds = Array.isArray(body.productIds) ? body.productIds : null;
    delete body.productIds;

    const existing = await Category.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Не найдено' });
    const oldSlug = existing.slug;
    const newSlug = body.slug || oldSlug;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: 'Не найдено' });

if (productIds && productIds.length > 0) {
      await Product.updateMany({ _id: { $in: productIds } }, { category: newSlug });
      // bu kategoriyadan chiqarib yuborilgan mahsulotlarni tozalash
      await Product.updateMany(
        { _id: { $nin: productIds }, category: newSlug },
        { $set: { category: null } }
      );
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Не найдено' });
    res.status(200).json({ success: true, message: 'Успешно удалено' });
  } catch (error) {
    errorResponse(res, error);
  }
};
