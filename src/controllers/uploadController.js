const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');
const errorResponse = require('../utils/errorResponse');

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// POST /api/upload/single  — bitta rasm
exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Файл не загружен' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'black-phoenix');

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    errorResponse(res, error, 'upload single');
  }
};

// POST /api/upload/multiple  — 1–3 ta rasm
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Файлы не загружены' });
    }

    const results = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, 'black-phoenix'))
    );

    const urls = results.map((r) => r.secure_url);

    res.json({ success: true, urls });
  } catch (error) {
    errorResponse(res, error, 'upload single');
  }
};
