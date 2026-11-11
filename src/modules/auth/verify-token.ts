import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { UserModel } from '../../database/models/user.model';

export const verifyToken = async (req: Request ) => {
  try {
    const token = req.header('authorization')?.slice(7);

    if (!token) {
      return null;
    }
    const data = verify(token, 'secret');

    if (typeof data === 'object' && data !== null) {
      const id = data.id;
      const user = await UserModel.findByPk(id);

      if(!user || !user.isActive) {
        return null;
      }

      console.log(id);

      return user;
    }

    return null;
  } catch (error) {
    return null;
  }
};
