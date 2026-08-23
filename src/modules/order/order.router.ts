import express from 'express';
import logger from '../../logger/index';
import { getmockorder } from '../../mocks/getmockorder';

const orderRouter = express.Router();

orderRouter.post('/', (req, res) => {
  const { name, order } = req.body;

  if (typeof name !== 'string' || typeof order !== 'string') {
    const message = 'Имя или заказ не переданы либо пустые';
    res.status(400).json({ message });
    logger.error(`[Ошибка создания заказа]: ${message}`);
    return;
  }

  const newOrder = getmockorder();

  logger.info(`Создан случайный заказ`);
  res.json(newOrder);
});

orderRouter.get('/', (req, res) => {
  const orders = getmockorder(5);
  logger.info(`Сгенерировано 5 заказов`);
  res.json(orders);
});

orderRouter.get('/:id', (req, res) => {
  const order = getmockorder();

  logger.info(`Сгенерирован заказ`);
  res.json(order);
});
export default orderRouter;
