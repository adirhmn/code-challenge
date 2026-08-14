import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import productRoutes from './routes/product.routes';
import { errorHandlerMiddleware } from './middlewares/error.middleware';
import { sendError } from './utils/response';

export function createApp(): Express {
  const app = express();

  // Security & Utility Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request Logging (disable during tests)
  if (process.env.NODE_ENV !== 'test') {
    app.use(pinoHttp());
  }

  // Health Check Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/v1/products', productRoutes);

  // 404 Route Handler
  app.use((req, res) => {
    return sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  });

  // Centralized Error Middleware
  app.use(errorHandlerMiddleware);

  return app;
}
