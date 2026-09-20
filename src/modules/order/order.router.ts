import express from 'express';
import logger from '../../logger/index';
import { getmockorder } from '../../mocks/getmockorder';
import { OrderCreateDto } from './dto/order-create.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

const orderRouter = express.Router();

orderRouter.post('/', (req, res) => {
  const dto = plainToInstance(OrderCreateDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
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
