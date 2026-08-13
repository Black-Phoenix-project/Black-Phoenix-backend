const magicSignatures = [
  { name: 'jpeg', bytes: [0xff, 0xd8, 0xff] },
  { name: 'png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { name: 'gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { name: 'bmp', bytes: [0x42, 0x4d] },
];

const isWebp = (buffer) =>
  buffer.length >= 12 &&
  buffer[0] === 0x52 &&
  buffer[1] === 0x49 &&
  buffer[2] === 0x46 &&
  buffer[3] === 0x46 &&
  buffer.toString('ascii', 8, 12) === 'WEBP';

const isValidImage = (buffer) => {
  if (!buffer || buffer.length < 4) return false;

  for (const sig of magicSignatures) {
    if (sig.bytes.every((b, i) => buffer[i] === b)) return true;
  }

  return isWebp(buffer);
};

const fileTypeCheck = (req, res, next) => {
  const files = req.file ? [req.file] : req.files || [];

  for (const file of files) {
    if (!isValidImage(file.buffer)) {
      return res.status(400).json({
        success: false,
        message: 'Файл не является допустимым изображением',
      });
    }
  }

  next();
};

module.exports = fileTypeCheck;
