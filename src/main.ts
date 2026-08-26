import express from 'express';
import logger from './logger/index';
import orderRouter from './modules/order/order.router';
import userRouter from './modules/user/user.router';
import { logRoutes } from './bootstrap/log-routes';

const server = express();
server.use(express.json());
server.use('/order', orderRouter);
server.use('/user', userRouter);
logRoutes(server);

server.listen(2000, () => {
  logger.info('Server is running on port 2000');
});
