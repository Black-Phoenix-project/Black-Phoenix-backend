const mongoose = require('mongoose');
const Like = require('../models/likeModel');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.addLike = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Укажите userId и productId',
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный userId или productId',
      });
    }

    const existing = await Like.findOne({ userId, productId })
      .populate('productId')
      .lean();

    if (existing) {
      return res.status(200).json({
        success: true,
        liked: true,
        message: 'Уже добавлено в избранное',
        data: existing,
      });
    }

    const created = await Like.create({ userId, productId });
    const populated = await Like.findById(created._id).populate('productId').lean();

    return res.status(201).json({
      success: true,
      liked: true,
      message: 'Товар добавлен в избранное',
      data: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка при добавлении в избранное',
    });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const productId = req.body.productId || req.query.productId;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Укажите userId и productId',
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный userId или productId',
      });
    }

    const removed = await Like.findOneAndDelete({ userId, productId });

    return res.status(200).json({
      success: true,
      liked: false,
      message: removed ? 'Удалено из избранного' : 'Избранное не найдено',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка при удалении из избранного',
    });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Укажите userId и productId',
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный userId или productId',
      });
    }

    const existing = await Like.findOne({ userId, productId });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      return res.status(200).json({
        success: true,
        liked: false,
        message: 'Like removed successfully',
      });
    }

    const created = await Like.create({ userId, productId });
    const populated = await Like.findById(created._id).populate('productId').lean();

    return res.status(201).json({
      success: true,
      liked: true,
      message: 'Товар добавлен в избранное',
      data: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка при переключении избранного',
    });
  }
};

exports.getUserLikes = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Укажите userId',
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный userId',
      });
    }

    const likes = await Like.find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: likes.length,
      data: likes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении избранного',
    });
  }
};

exports.checkLike = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Укажите userId и productId',
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный userId или productId',
      });
    }

    const like = await Like.findOne({ userId, productId }).lean();

    return res.status(200).json({
      success: true,
      liked: Boolean(like),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка при проверке статуса',
    });
  }
};

exports.getProductLikeCount = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный productId',
      });
    }

    const count = await Like.countDocuments({ productId });

    return res.status(200).json({
      success: true,
      productId,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении количества избранных',
    });
  }
};
