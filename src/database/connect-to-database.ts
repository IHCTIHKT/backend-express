import { Sequelize } from 'sequelize-typescript';
import logger from '../logger';
import { FoodCategory, FoodModel } from './models/food.models';
import { OrderModel } from './models/order.model';
import { UserModel } from './models/user.model';

export const connectToDatabase = async () => {
  const connection = new Sequelize({
    logging: false,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });
  connection.addModels([UserModel, OrderModel, FoodModel]);

  try {
    await connection.authenticate();
  } catch (error) {
    logger.error(error);
    throw error;
  }

  try {
    await connection.sync({ alter: true });
    const foodsCount = await FoodModel.count();

    if (foodsCount === 0) {
      await FoodModel.bulkCreate([
        {
          name: 'ГазБургер',
          category: FoodCategory.burgers,
          price: 250,
        },
        {
          name: 'ГазПицца',
          category: FoodCategory.pizza,
          price: 450,
        },
        {
          name: 'ГазКола',
          category: FoodCategory.drinks,
          price: 150,
        },
        {
          name: 'Наггетсы',
          category: FoodCategory.main,
          price: 200,
        },
      ]);

      console.log('Тестовые блюда добавлены!');
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }

  logger.info('Connected to database');
};
