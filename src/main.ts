import express from 'express';
import logger from './logger/index';
import taskRouter from './modules/task/task.router';
import userRouter from './modules/user/user.router';
import { logRoutes } from './bootstrap/log-routes';

const server = express();
server.use(express.json());
server.use('/task', taskRouter);
server.use('/user', userRouter);
logRoutes(server);

server.listen(2000, () => {
  logger.info('Server is running on port 2000');
});
