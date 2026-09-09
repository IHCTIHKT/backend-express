import express from 'express';
import logger from './logger/index';
import orderRouter from './modules/order/order.router';
import userRouter from './modules/user/user.router';
import { logRoutes } from './bootstrap/log-routes';
import appConfig from './config';
import { LogRequestMiddleware } from './middlewares/log-request.middleware';

const server = express();
server.use(express.json());

server.use(LogRequestMiddleware);

server.use('/order', orderRouter);
server.use('/user', userRouter);
logRoutes(server);

server.listen(appConfig.port, () => {
  logger.info(`Server started on port ${appConfig.port}`);
});