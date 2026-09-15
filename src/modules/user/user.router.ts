import express from 'express';
import { getMockUser } from '../../mocks/get-user-mocks';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
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

userRouter.post('/register', (req, res) => {
  const dto = plainToInstance(UserRegisterDto, req.body);
  const error = validateSync(dto);
  if (error.length > 0) {
    res.status(400).json(error);
    return;
  }
  const user = getMockUser();
  res.json(user);
});

export default userRouter;
