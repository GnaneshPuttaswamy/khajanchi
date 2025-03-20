import express, { Request, Response } from 'express';
import { RegisterUserUseCase } from './RegisterUserUseCase.js';
import { LoginUserUseCase } from './LoginUserUseCase.js';

const router = express.Router();

router.post('/users/register', async (req: Request, res: Response) => {
  const userRegisterUseCase = RegisterUserUseCase.create(req, res);
  await userRegisterUseCase.executeAndHandleErrors();
});

router.post('/users/login', async (req: Request, res: Response) => {
  const loginUserUseCase = LoginUserUseCase.create(req, res);
  await loginUserUseCase.executeAndHandleErrors();
});

export default router;
