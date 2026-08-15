require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const swaggerDocs = require('./config/swagger');
const authRouter = require('./routes/authRoutes');
const clientAuthRouter = require('./routes/authClient');
const swiperRouter = require('./routes/swiperRoutes');
const productRoutes = require('./routes/productRoutes');
const workerRoutes = require('./routes/workersRoute');
const orderRoutes = require('./routes/orderRoutes');
const likeRoutes = require('./routes/likeRoutes');
const searchRoutes = require('./routes/searchRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://blackphoenix.uz,https://www.blackphoenix.uz,https://admin.blackphoenix.uz,https://blackphoenix-clientbek.vercel.app')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow Vercel preview deployments (client + admin) for testing
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

swaggerDocs(app);
connectDB();

app.use('/api/auth', authRouter);
app.use('/api/client-auth', clientAuthRouter);
app.use('/api/swiper', swiperRouter);
app.use('/api/product', productRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, message: 'Файл слишком большой (макс. 10 МБ)' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ success: false, message: 'Недопустимое поле файла' });
    }
    return res.status(400).json({ success: false, message: 'Ошибка загрузки файла' });
  }

  if (err && err.message === 'Faqat rasm fayllari qabul qilinadi (jpg, png, webp ...)') {
    return res.status(400).json({ success: false, message: 'Разрешены только изображения' });
  }

  if (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
