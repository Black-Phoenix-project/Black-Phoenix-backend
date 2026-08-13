const Product = require('../models/Product');
const errorResponse = require('../utils/errorResponse');

const normalizeImages = (value) => {
  if (Array.isArray(value)) {
    return value.filter((img) => typeof img === 'string' && img.trim());
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const images = normalizeImages(req.body.image ?? req.body.images);

    if (!name || !description || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Укажите название, описание и цену'
      });
    }

    if (images.length < 1 || images.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Количество изображений должно быть от 1 до 3'
      });
    }

    const payload = {
      ...req.body,
      image: images
    };
    delete payload.images;

    const product = await Product.create(payload);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product .findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Не найдено' });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const payload = { ...req.body };
    const imageFieldProvided = Object.prototype.hasOwnProperty.call(req.body, 'image')
      || Object.prototype.hasOwnProperty.call(req.body, 'images');

    if (imageFieldProvided) {
      const images = normalizeImages(req.body.image ?? req.body.images);
      if (images.length < 1 || images.length > 3) {
        return res.status(400).json({
          success: false,
          message: 'Количество изображений должно быть от 1 до 3'
        });
      }
      payload.image = images;
      delete payload.images;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!product)
      return res.status(404).json({ success: false, message: 'Не найдено' });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
exports.patchProduct = async (req, res) => {
  try {
    const payload = { ...req.body };
    const imageFieldProvided = Object.prototype.hasOwnProperty.call(req.body, 'image')
      || Object.prototype.hasOwnProperty.call(req.body, 'images');

    if (imageFieldProvided) {
      const images = normalizeImages(req.body.image ?? req.body.images);
      if (images.length < 1 || images.length > 3) {
        return res.status(400).json({
          success: false,
          message: 'Количество изображений должно быть от 1 до 3'
        });
      }
      payload.image = images;
      delete payload.images;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true }
    );

    if (!product)
      return res.status(404).json({ success: false, message: 'Не найдено' });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Не найдено' });

    res.status(200).json({
      success: true,
      message: 'Успешно удалено'
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
