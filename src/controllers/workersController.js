const Worker = require("../models/Workers");
const errorResponse = require("../utils/errorResponse");

const handleValidation = (res, err) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: "Ошибка валидации" });
  }
  return errorResponse(res, err);
};

exports.createWorker = async (req, res) => {
  try {
    const worker = await Worker.create(req.body);

    res.status(201).json({
      success: true,
      data: worker,
    });
  } catch (err) {
    handleValidation(res, err);
  }
};
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().lean();

    res.json({
      success: true,
      count: workers.length,
      data: workers,
    });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker)
      return res.status(404).json({ message: "Работник не найден" });

    res.json({
      success: true,
      data: worker,
    });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!worker)
      return res.status(404).json({ message: "Работник не найден" });

    res.json({
      success: true,
      data: worker,
    });
  } catch (err) {
    handleValidation(res, err);
  }
};
exports.deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);

    if (!worker)
      return res.status(404).json({ message: "Работник не найден" });

    res.json({
      success: true,
      message: "Успешно удалено",
    });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.getWorkersByDepartment = async (req, res) => {
  try {
    const workers = await Worker.find({
      department: req.params.department,
    });

    res.json({
      success: true,
      count: workers.length,
      data: workers,
    });
  } catch (err) {
    errorResponse(res, err);
  }
};
