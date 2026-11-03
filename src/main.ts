import express from 'express';
import { logRoutes } from './bootstrap/log-routes';
import appConfig from './config';
import { connectToDatabase } from './database/connect-to-database';
import logger from './logger/index';
import { LogRequestMiddleware } from './middlewares/log-request.middleware';
import { adminRouter } from './modules/admin/admin.router';
import orderRouter from './modules/order/order.router';
import userRouter from './modules/user/user.router';

const start = async () => {
  await connectToDatabase();

  const server = express();
  server.use(express.json());

  server.use(LogRequestMiddleware);

  server.use('/order', orderRouter);
  server.use('/user', userRouter);
  server.use('/admin', adminRouter);
  logRoutes(server);

  server.listen(appConfig.port, () => {
    logger.info(`Server started on port ${appConfig.port}`);
  });
};

start();