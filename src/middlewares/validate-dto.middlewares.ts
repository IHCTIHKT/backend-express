import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validateDTO = (req: Request, res: Response, next: NextFunction) => {

}