import express from 'express';
import { config } from 'dotenv';
import logger from './logger/index';
import orderRouter from './modules/order/order.router';
import userRouter from './modules/user/user.router';
import { logRoutes } from './bootstrap/log-routes';

config();

const server = express();
server.use(express.json());
server.use('/order', orderRouter);
server.use('/user', userRouter);
logRoutes(server);

server.listen(process.env.PORT, () => {
  logger.info(`Server started on port ${process.env.PORT}`);
});