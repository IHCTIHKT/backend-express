import express from 'express';
import { getMockUser } from '../../mocks/get-user-mocks';
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