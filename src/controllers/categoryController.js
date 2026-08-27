const Category = require('../models/Category');
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
    const { name, slug, order, active } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Укажите название и slug' });
    }
    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Категория с таким slug уже существует' });
    }
    const category = await Category.create({ name, slug, order, active });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: 'Не найдено' });
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
