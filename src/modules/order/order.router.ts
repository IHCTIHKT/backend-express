import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import express from 'express';
import { OrderModel } from '../../database/models/order.model';
import logger from '../../logger/index';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderDeleteDto } from './dto/order-delete.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { OrderUpdateDto } from './dto/order-update.dto';

const orderRouter = express.Router();

orderRouter.post('/', async (req, res) => {
  const dto = plainToInstance(OrderCreateDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }
  const newOrder = await OrderModel.create({
    userId: dto.userId,
    product: dto.product,
    quantity: dto.quantity,
    price: dto.price,
    status: dto.status,
  });
  logger.info(`Создан случайный заказ`);
  res.json(newOrder);
});

orderRouter.get('/', async (req, res) => {
  const orders = await OrderModel.findAll({});
  const dto = plainToInstance(OrderPaginationDto, req.query);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;

    const orders = await OrderModel.findAll({
      limit: dto.limit,
      offset: dto.offset,
    });
  }
  logger.info(`Заказы найдены!`);
  res.json(orders);
});

orderRouter.get('/:id', async (req, res) => {
  const order = await OrderModel.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (order === null) {
    res.status(404).json({ message: 'Заказ не найден' });
    return;
  }

  logger.info(`Заказ найден!`);
  res.json(order);
});

orderRouter.delete('/:id', async (req, res) => {
  const dto = plainToInstance(OrderDeleteDto, {
    id: req.params.id,
  });
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }
  await OrderModel.destroy({
    where: {
      id: dto.id,
    },
  });
  logger.info(`Заказ удален!`);
  res.json({ message: 'Заказ удален!' });
});

orderRouter.put('/:id', async (req, res) => {
  const dto = plainToInstance(OrderUpdateDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }

  await OrderModel.update(
    {
      product: dto.product,
      quantity: dto.quantity,
      price: dto.price,
      status: dto.status,
    },
    {
      where: {
        id: req.params.id,
      },
    },
  );
  logger.info(`Заказ обновлен`);
  res.json({ message: 'Заказ обновлен!' });
});

export default orderRouter;
