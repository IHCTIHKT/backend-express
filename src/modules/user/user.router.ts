import axios from 'axios';
import { compare, hashSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CronJob } from 'cron';
import express from 'express';
import * as jwt from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';
import { UserModel } from '../../database/models/user.model';
import logger from '../../logger';
import { UserLoginDto } from './user-login.dto';
import { UserRegisterDto } from './user-register.dto';

const userRouter = express.Router();

const TempDomainListUpdates = new CronJob('* * * * *', loadDomain, null, true);

let domains: string[] = [];

export async function loadDomain() {
  const response = await axios.get(
    'https://raw.githubusercontent.com/disposable/disposable-email-domains/refs/heads/master/domains.txt',
  );
  domains = response.data.split('\n');
  logger.info(`Всего временных доменов ${domains.length}`);
}
loadDomain();

userRouter.post('/register', async (req, res) => {
  const dto = plainToInstance(UserRegisterDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }

  const domain = req.body.email.split('@')[1];
  console.log(domain);

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

  const tokens = jwt.sign({ id: userEmailSearch.id }, 'secret', { expiresIn: '1h' });

  res.json({
    id: userEmailSearch.id,
    email: userEmailSearch.email,
    token: tokens,
  });
});
userRouter.get('/profile', async (req, res) => {
  const token = req.header('authorization')?.slice(7);
  if (!token) {
    return res.status(401).json({ message: 'Залогиньтесь!' });
  }
  try {
    const data = verify(token, 'secret');
    if (typeof data === 'object' && data !== null) {
      const id = data.id;
      const user = await UserModel.findByPk(id);

      console.log(id);

      if (!user) {
        return res.status(401).json({ message: 'Пользователь не найден!' });
      }

      return res.json({
        id: user.id,
        email: user.email,
      });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Токен неверный или истек!' });
  }

  return res.json({ message: 'Вы пытаетесь прочесть профиль.' });
});