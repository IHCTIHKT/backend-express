import express from 'express';
import { getMockUser } from '../../mocks/get-user-mocks';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserModel } from '../../database/models/user.model';

const userRouter = express.Router();

userRouter.post('/login', (req, res) => {
  const dto = plainToInstance(UserLoginDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }
  const user = getMockUser();
  res.json(user);
});

userRouter.post('/register', async (req, res) => {
  const dto = plainToInstance(UserRegisterDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }

  const userEmailSearch = await UserModel.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (userEmailSearch !== null) {
    res.status(400).json({ message: 'Такой пользователь уже зарегистрирован!' });
    return;
  }

  const user = await UserModel.create({
    email: req.body.email,
    password: req.body.password,
  });
  res.json(user);
});
export default userRouter;