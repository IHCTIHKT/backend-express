import axios from 'axios';
import { compare, hashSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import express from 'express';
import { UserModel } from '../../database/models/user.model';
import { UserLoginDto } from './user-login.dto';
import { UserRegisterDto } from './user-register.dto';

const userRouter = express.Router();

userRouter.post('/login', async (req, res) => {
  const dto = plainToInstance(UserLoginDto, req.body);
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

  if (!userEmailSearch) {
    res.status(400).json({ message: 'Неверный email или пароль' });
    return;
  }
  const result = await compare(req.body.password, userEmailSearch.password);

  if (!result) {
    res.status(400).json({ message: 'Неверный email или пароль' });
    return;
  }
  res.json({
    id: userEmailSearch.id,
    email: userEmailSearch.email,
  });
});

userRouter.post('/register', async (req, res) => {
  const dto = plainToInstance(UserRegisterDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }

  const domain = req.body.email.split('@')[1];
  console.log(domain);

  const response = await axios.get(
    'https://raw.githubusercontent.com/disposable/disposable-email-domains/refs/heads/master/domains.txt',
  );
  const domains = response.data.split('\n');
  const isTemp = domains.find((d: string) => d === domain);

  if (isTemp) {
    res.status(400).json({
      message: 'Регистрация на временную почту запрещена!!!',
    });
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

  const hashedPassword = hashSync(req.body.password, 10);

  const user = await UserModel.create({
    email: req.body.email,
    password: hashedPassword,
  });

  res.json(user);
});

export default userRouter;
