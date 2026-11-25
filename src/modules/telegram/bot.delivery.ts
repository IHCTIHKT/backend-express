import { Markup, Telegraf } from 'telegraf';
import { FoodModel } from "../../database/models/food.models";
import { OrderModel, OrderStatus } from '../../database/models/order.model';
import { UserModel, UserRole } from '../../database/models/user.model';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN не найден в .env');
}

export const telegramBot = new Telegraf(token);

telegramBot.command('start', async (ctx) => {
  const telegramId = ctx.from.id;

  const admin = await UserModel.findOne({
    where: {
      telegramId,
      role: UserRole.admin,
      isActive: true,
    },
  });

  const buttons = [
    [Markup.button.callback('🍔 Заказать еду', 'order_food')],
    [Markup.button.callback('📦 Мои заказы', 'my_orders')],
    [Markup.button.callback('❓ Помощь', 'help')],
  ];

  if (admin) {
    buttons.push([Markup.button.callback('⚙️ Админ-панель', 'admin_panel')]);
  }

  await ctx.sendMessage('🍔 Добро пожаловать в Fake Delivery! Выберите действие 👇', Markup.inlineKeyboard(buttons));
});
telegramBot.action('order_food', async (ctx) => {
  await ctx.answerCbQuery();

  const foods = await FoodModel.findAll();
  console.log('Блюда из БД:', foods);

  const buttons = foods.map((food) => [Markup.button.callback(`${food.name} — ${food.price} ₽`, `food:${food.id}`)]);

  await ctx.sendMessage('🍔 Наше меню:', Markup.inlineKeyboard(buttons));
});

telegramBot.action(/^food:(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const foodId = Number(ctx.match[1]);

  const food = await FoodModel.findByPk(foodId);

  if (!food) {
    await ctx.sendMessage('Блюдо не найдено!');
    return;
  }

  await ctx.sendMessage(`Блюдо ${food.name} добавлено в корзину!`);
});
telegramBot.command('id', (ctx) => {
  console.log('Group id:', ctx.chat.id);
});

telegramBot.command('cooking', async (ctx) => {
  const telegramId = ctx.from.id;

  const admin = await UserModel.findOne({
    where: {
      telegramId,
      role: UserRole.admin,
      isActive: true,
    },
  });
  if (!admin) {
    await ctx.sendMessage('У вас нет доступа к данной команде!');
    return;
  }

  const cookingOrders = await OrderModel.findAll({
    where: {
      status: OrderStatus.cooking,
    },
  });

  if (cookingOrders.length === 0) {
    await ctx.sendMessage('На данный момент заказов в статусе cooking нет!');
    return;
  }

  for (const order of cookingOrders) {
    const message = `
📦 Заказ №${order.id}
🍔 Товар: ${order.product}
🔢 Количество: ${order.quantity}
💰 Цена: ${order.price}
🚚 Тип: ${order.type}`;

    await ctx.sendMessage(message, {

      parse_mode: 'MarkdownV2',
    });
  }
});

telegramBot.command('delivery', async (ctx) => {
  const telegramId = ctx.from.id;

  const admin = await UserModel.findOne({
    where: {
      telegramId,
      role: UserRole.admin,
      isActive: true,
    },
  });
  if (!admin) {
    await ctx.sendMessage('У вас нет доступа к данной команде!');
    return;
  }

  const deliveringOrders = await OrderModel.findAll({
    where: {
      status: OrderStatus.delivering,
    },
  });

  if (deliveringOrders.length === 0) {
    await ctx.sendMessage('На данный момент заказов в статусе delivering нет!');
    return;
  }

  for (const order of deliveringOrders) {
    const message = `
📦 Заказ №${order.id}
🍔 Товар: ${order.product}
🔢 Количество: ${order.quantity}
💰 Цена: ${order.price}
🚚 Тип: ${order.type}`;

    await ctx.sendMessage(message, {

      parse_mode: 'MarkdownV2',
    });
  }
});