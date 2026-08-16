const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
  try {
    const { username, phoneNumber, description, product, userId, notes } = req.body;

    if (!username || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Укажите имя и номер телефона' });
    }

    if (!product || !product.productName) {
      return res.status(400).json({ success: false, message: 'Информация о товаре обязательна' });
    }

    const quantity = Math.max(1, Math.min(1000, Math.floor(Number(product.quantity) || 1)));

    let price;
    let productName = product.productName;

    if (product.productId) {
      if (!mongoose.Types.ObjectId.isValid(product.productId)) {
        return res.status(400).json({ success: false, message: 'Неверный productId' });
      }

      const dbProduct = await Product.findById(product.productId).lean();
      if (!dbProduct) {
        return res.status(400).json({ success: false, message: 'Товар не найден' });
      }

      price = Number(dbProduct.price);
      productName = dbProduct.name;
    } else {
      price = Number(product.price);
    }

    if (!price || price <= 0) {
      return res.status(400).json({ success: false, message: 'Неверная цена товара' });
    }

    const totalAmount = price * quantity;

    const newOrder = new Order({
      username,
      phoneNumber,
      description,
      product: {
        productId: product.productId,
        productName,
        price,
        quantity,
        image: product.image,
      },
      totalAmount,
      userId,
      notes,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, message: 'Заказ успешно создан', data: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при создании заказа'});
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('userId', 'username phoneNumber avatar')
    
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при получении заказов'});
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'username phoneNumber avatar');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Заказ не найден' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при получении заказа'});
  }
};

exports.getOrdersByUsername = async (req, res) => {
  try {
    const orders = await Order.find({
      username: req.params.username,
      userId: req.clientId,
    })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при получении заказов'});
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при получении заказов'});
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Неверное значение статуса' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Заказ не найден' });

    res.status(200).json({ success: true, message: 'Статус заказа успешно обновлён', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при обновлении заказа'});
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];

    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Неверное значение статуса оплаты' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Заказ не найден' });

    res.status(200).json({ success: true, message: 'Статус оплаты успешно обновлён', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при обновлении статуса оплаты'});
  }
};

exports.updateOrder = async (req, res) => {
  try {
    if (req.body.product) {
      const price = Number(req.body.product.price) || 0;
      const quantity = Number(req.body.product.quantity) || 1;
      req.body.totalAmount = price * quantity;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) return res.status(404).json({ success: false, message: 'Заказ не найден' });

    res.status(200).json({ success: true, message: 'Заказ успешно обновлён', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при обновлении заказа'});
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Заказ не найден' });

    res.status(200).json({ success: true, message: 'Заказ успешно удалён' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting order'});
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const last7Days = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: totalRevenueAgg[0]?.total || 0,
        last7Days, 
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при получении статистики'});
  }
};