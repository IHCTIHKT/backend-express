import { NextFunction, Request, Response } from 'express';
import logger from '../logger';

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  res.status(500).json({ message: err.message });
};
