const Swiper = require('../models/Swiper');
const errorResponse = require('../utils/errorResponse');

exports.getAllSwipers = async (req, res) => {
    try {
        const swipers = await Swiper.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: swipers.length,
            data: swipers
        });
    } catch (error) {
        errorResponse(res, error);
    }
};

exports.getSwiperById = async (req, res) => {
    try {
        const swiper = await Swiper.findById(req.params.id);
        
        if (!swiper) {
            return res.status(404).json({
                success: false,
                message: 'Элемент не найден'
            });
        }
        
        res.status(200).json({
            success: true,
            data: swiper
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Элемент не найден'
            });
        }
        
        errorResponse(res, error);
    }
};

exports.createSwiper = async (req, res) => {
    try {
        const { image, title, description } = req.body;

        if (!image || !title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Укажите все обязательные поля: image, title, description'
            });
        }

        const swiper = await Swiper.create({
            image,
            title,
            description
        });
        
        res.status(201).json({
            success: true,
            message: 'Элемент успешно создан',
            data: swiper
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Ошибка валидации',
                errors: messages
            });
        }
        
        errorResponse(res, error);
    }
};

exports.updateSwiper = async (req, res) => {
    try {
        const { image, title, description } = req.body;
        
        const updateFields = {};
        if (image) updateFields.image = image;
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        
        const swiper = await Swiper.findByIdAndUpdate(
            req.params.id,
            updateFields,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!swiper) {
            return res.status(404).json({
                success: false,
                message: 'Элемент не найден'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Элемент успешно обновлён',
            data: swiper
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Элемент не найден'
            });
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Ошибка валидации',
                errors: messages
            });
        }
        
        errorResponse(res, error);
    }
};

exports.deleteSwiper = async (req, res) => {
    try {
        const swiper = await Swiper.findByIdAndDelete(req.params.id);
        
        if (!swiper) {
            return res.status(404).json({
                success: false,
                message: 'Элемент не найден'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Элемент успешно удалён',
            data: {}
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Элемент не найден'
            });
        }
        
        errorResponse(res, error);
    }
};