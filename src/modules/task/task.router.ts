import express from 'express';
import logger from '../../logger/index';
const taskRouter = express.Router();

type OrderOfYandexDelivery = {
  id: number;
  name: string;
  order: string;
};

const orders: OrderOfYandexDelivery[] = [];

taskRouter.post('/order', (req, res) => {
  const { name, order } = req.body;

  if (typeof name !== 'string' || typeof order !== 'string') {
    const message = 'Имя или заказ не переданы либо пустые';
    res.status(400).json({ message });
    logger.error(`[Ошибка создания заказа]: ${message}`);
    return;
  }

  const newOrder: OrderOfYandexDelivery = {
    id: orders.length + 1,
    name: name,
    order: order,
  };

  orders.push(newOrder);
  logger.info(`Создан заказ: ${newOrder.id}, name: ${newOrder.name}`);
  res.json(newOrder);
});

taskRouter.get('/order', (req, res) => {
  logger.info(`Список из ${orders.length} ваших заказов`);
  res.json(orders);
});

taskRouter.get('/order/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundOrder = orders.find((order) => order.id === id);

  if (foundOrder) {
    logger.info(`Найден заказ id=${id}`);
    res.json(foundOrder);
  } else {
    logger.warn(`Заказ с id=${id} не найден`);
    res.status(404).json({ message: `Заказ с id=${id} не существует` });
  }
});
export default taskRouter;