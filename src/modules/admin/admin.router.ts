import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { Router } from 'express';
import { OrderModel } from "../../database/models/order.model";
import logger from "../../logger";
import { verifyToken } from '../auth/verify-token';
import { OrderPaginationDto } from "../order/dto/order-pagination.dto";

export const adminRouter = Router();

adminRouter.get('/order', async (req, res) => {

    const token = req.header('authorization')?.slice(7);

    if (!token) {
      res.status(401).json({ message: 'Залогиньтесь!' });
      return;
    }

    const user = await verifyToken(token);

    if (!user) {
      res.status(401).json({ message: 'Токен неверный или пользователь не найден!', });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Недостаточно прав!', });
      return;
    }

    const dto = plainToInstance(OrderPaginationDto, req.query);
  const error = validateSync(dto);

  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }

  const orders = await OrderModel.findAll({
    limit: dto.limit,
    offset: dto.offset,
  });
  logger.info(`Заказы найдены!`);
  res.json(orders);
});

adminRouter.get('/order/:id', async (req, res) => {
  const token = req.header('authorization')?.slice(7);

  if (!token) {
    res.status(401).json({ message: 'Залогиньтесь!' });
    return;
  }

  const user = await verifyToken(token);

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