import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { env } from './config/environment';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '..', env.UPLOAD_DIR || 'uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`Created uploads directory: ${uploadsDir}`);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static file serving for uploaded images
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Error Handling
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, env.HOST, () => {
  logger.info(`Backend server running on http://${env.HOST}:${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});
