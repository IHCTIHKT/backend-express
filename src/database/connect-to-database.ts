import { Sequelize } from 'sequelize-typescript';
import logger from '../logger';
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
  connection.addModels([UserModel, OrderModel]);

  try {
    await connection.authenticate();
  } catch (error) {
    logger.error(error);
    throw error;
  }

  try {
    await connection.sync({ alter: true });
  } catch (error) {
    logger.error(error);
    throw error;
  }

  logger.info('Connected to database');
};
