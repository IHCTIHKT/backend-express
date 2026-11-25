import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import express from 'express';
import { Op } from 'sequelize';
import { OrderModel, OrderStatus, OrderType } from '../../database/models/order.model';
import { UserModel, UserRole } from '../../database/models/user.model';
import logger from '../../logger/index';
import { verifyToken } from '../auth/verify-token';
import { telegramBot } from '../telegram/bot.delivery';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { OrderUpdateDto } from './dto/order-update.dto';

const orderRouter = express.Router();
const adminGroupChatId = '-1003776664052';

orderRouter.post('/', async (req, res) => {

  const user = await verifyToken(req);

  if (!user) {
    res.status(401).json({ message: 'Токен неверный или пользователь не найден!' });
    return;
  }
  const dto = plainToInstance(OrderCreateDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }

  if (dto.type === OrderType.delivery && (user.address === null || user.address === undefined)) {
    res.status(400).json({ message: 'Для доставки необходимо указать адрес в профиле!' })
    return;
  }

  const newOrder = await OrderModel.create({
    userId: user.id,
    product: dto.product,
    quantity: dto.quantity,
    price: dto.price,
    status: OrderStatus.cooking,
    type: dto.type,
  });
      try {
        await telegramBot.telegram.sendMessage(
          adminGroupChatId,
          `*🛎 НОВЫЙ ЗАКАЗ\\!*

📦 *Заказ №${newOrder.id}*
🍔 *Товар:* ${newOrder.product}
🚚 *Тип:* ${newOrder.type === OrderType.delivery ? 'Доставка' : 'Самовывоз'}
🔥 *Статус:* ${newOrder.status === OrderStatus.cooking ? 'Готовится' : newOrder.status}`,
           
          { parse_mode: 'MarkdownV2' },
        );
      } catch (error) {
        logger.error('Не удалось отправить уведомление в группу');
      }
  logger.info(`Создан случайный заказ`);
  res.json(newOrder);
});

orderRouter.get('/', async (req, res) => {

  const user = await verifyToken(req);

  if (!user) {
    res.status(401).json({ message: 'Токен неверный или пользователь не найден!' });
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
      userId: user.id,
      ...(dto.type && { type: dto.type }),
      ...(dto.status && { status: dto.status }),
      },
      limit: dto.limit,
      offset: dto.offset,
    });
  logger.info(`Заказы найдены!`);
  res.json(orders);
});

orderRouter.get('/:id', async (req, res) => {
  const user = await verifyToken(req);

  if (!user) {
    res.status(401).json({ message: 'Токен неверный или пользователь не найден!' });
    return;
  }

  const order = await OrderModel.findOne({
    where: {
      id: req.params.id,
      userId: user.id,
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

  const user = await verifyToken(req);

  if (!user) {
    res.status(401).json({ message: 'Токен неверный или пользователь не найден!' });
    return;
  }

  const order = await OrderModel.findOne({
    where: {
      id: req.params.id,
      userId: user.id,
    },
  });

  if (order === null) {
    res.status(404).json({ message: 'Заказ не найден' });
    return;
  }

  if (order.status !== OrderStatus.cooking) {
    res.status(400).json({ message: 'Отмена доступна только для заказов в статусе «Готовят»' });
    return;
  }

  await order.update({ status: OrderStatus.cancelled });

  logger.info('Заказ отменён!');
  res.json(order);
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
      status: OrderStatus.cooking,
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