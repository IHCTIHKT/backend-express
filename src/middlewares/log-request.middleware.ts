import { NextFunction, Request, Response } from 'express';
import logger from '../logger';

export const LogRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Пришел запрос [${req.method}] ${req.originalUrl}`);

  next();
};
