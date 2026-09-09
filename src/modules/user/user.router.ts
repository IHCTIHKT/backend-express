import express from 'express';
import { getMockUser } from '../../mocks/get-user-mocks';
import { UserLoginDto } from './dto/user-login.dto';
const userRouter = express.Router();

userRouter.post('/login', (req, res) => {
  const user = getMockUser();
  res.json(user);
});

userRouter.post('/register', (req, res) => {
  const user = getMockUser();

  res.json(user);
});

export default userRouter;