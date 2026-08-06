process.env.TZ = 'America/Lima';

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { apiLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';

dotenv.config();

import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import orderRoutes from './routes/order.routes';
import adminDashboardRoutes from './routes/adminDashboard.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

app.set('trust proxy', 1);


app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(apiLimiter);


app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminDashboardRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Servidor Express escuchando en http://localhost:${PORT}`);
  logger.info('Backend started successfully!');
});
