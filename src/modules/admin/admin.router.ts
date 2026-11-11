import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Router } from 'express';
import { OrderModel, OrderStatus, OrderType } from '../../database/models/order.model';
import { UserModel } from '../../database/models/user.model';
import logger from '../../logger';
import { verifyToken } from '../auth/verify-token';
import { OrderPaginationDto } from '../order/dto/order-pagination.dto';

export const adminRouter = Router();

adminRouter.get('/order', async (req, res) => {
  const user = await verifyToken(req);

  if (!user) {
    res.status(401).json({ message: 'Токен неверный или пользователь не найден!' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Недостаточно прав!' });
    return;
  }

  const dto = plainToInstance(OrderPaginationDto, req.query);
  const error = validateSync(dto);

  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }

  const orders = await OrderModel.findAll({
    where: {
      ...(dto.type && { type: dto.type }),
      ...(dto.status && { status: dto.status }),
    },
    limit: dto.limit,
    offset: dto.offset,
  });
  logger.info(`Заказы найдены!`);
  res.json(orders);
});

adminRouter.get('/order/:id', async (req, res) => {
  const user = await verifyToken(req);

  if (!user) {
    res.status(401).json({ message: 'Токен неверный или пользователь не найден!' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Недостаточно прав!' });
    return;
  }

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

adminRouter.put('/order/:id', async (req, res) => {
  const user = await verifyToken(req);

  if (!user) {
    res.status(401).json({ message: 'Токен неверный или пользователь не найден!' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Недостаточно прав!' });
    return;
  }

  const order = await OrderModel.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (order === null) {
    res.status(404).json({ message: 'Заказ не найден' });
    return;
  }

  const newStatus = req.body.status;

  if (!Object.values(OrderStatus).includes(newStatus)) {
    res.status(400).json({ message: 'Недопустимый статус заказа' });
    return;
  }
  let isTransitionCheck = false;

  if (newStatus === OrderStatus.cancelled) {
    await order.update({ status: OrderStatus.cancelled });
    res.json(order);
    return;
  }

  if (order.type === OrderType.delivery) {
    if (order.status === OrderStatus.delivering && newStatus === OrderStatus.done) {
      isTransitionCheck = true;
    }
    if (order.status === OrderStatus.cooking && newStatus === OrderStatus.delivering) {
      isTransitionCheck = true;
    }
  }

  if (order.type === OrderType.pickup) {
    if (order.status === OrderStatus.cooking && newStatus === OrderStatus.ready_to_pickup) {
      isTransitionCheck = true;
    }
    if (order.status === OrderStatus.ready_to_pickup && newStatus === OrderStatus.done) {
      isTransitionCheck = true;
    }
  }

  if (!isTransitionCheck) {
    res.status(400).json({ message: 'Недопустимый переход статуса заказа!' });
    return;
  }
  await order.update({ status: newStatus });
  res.json(order);
});

adminRouter.put('/users/:id', async (req, res) => {
  const controlUser = await verifyToken(req);

  if (!controlUser) {
    res.status(401).json({ message: 'Токен неверный или пользователь не найден!' });
    return;
  }

  if (controlUser.role !== 'admin') {
    res.status(403).json({ message: 'Недостаточно прав!' });
    return;
  }

  const user = await UserModel.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    res.status(404).json({ message: 'Пользователь не найден!' });
    return;
  }

  const isActive = req.body.isActive;
  if (typeof isActive !== 'boolean') {
    res.status(400).json({ message: 'Поле isActive должно быть true или false' });
    return;
  }