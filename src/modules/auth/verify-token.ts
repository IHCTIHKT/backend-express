import { verify } from 'jsonwebtoken';
import { UserModel } from '../../database/models/user.model';

export const verifyToken = async (token: string) => {
  try {
    const data = verify(token, 'secret');

    if (typeof data === 'object' && data !== null) {
      const id = data.id;
      const user = await UserModel.findByPk(id);

      console.log(id);

      return user;
    }

    return null;
  } catch (error) {
    return null;
  }
};
