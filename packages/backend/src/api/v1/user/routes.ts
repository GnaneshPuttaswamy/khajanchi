import express, { Request, Response } from 'express';
import { RegisterUserUseCase } from './RegisterUserUseCase.js';
import { LoginUserUseCase } from './LoginUserUseCase.js';
import { GetUserProfileUseCase } from './GetUserProfileUseCase.js';
import { RequestResetPasswordUseCase } from './RequestResetPasswordUseCase.js';
import { ResetPasswordUseCase } from './ResetPasswordUseCase.js';

const router = express.Router();

router.post('/users/register', async (req: Request, res: Response) => {
  const userRegisterUseCase = RegisterUserUseCase.create(req, res);
  await userRegisterUseCase.executeAndHandleErrors();
});

router.post('/users/login', async (req: Request, res: Response) => {
  const loginUserUseCase = LoginUserUseCase.create(req, res);
  await loginUserUseCase.executeAndHandleErrors();
});

router.get('/users/profile', async (req: Request, res: Response) => {
  const getUserProfileUseCase = GetUserProfileUseCase.create(req, res);
  await getUserProfileUseCase.executeAndHandleErrors();
});

router.post('/users/request-password-reset', async (req: Request, res: Response) => {
  const requestResetPasswordUseCase = RequestResetPasswordUseCase.create(req, res);
  await requestResetPasswordUseCase.executeAndHandleErrors();
});

router.post('/users/reset-password', async (req: Request, res: Response) => {
  const resetPasswordUseCase = ResetPasswordUseCase.create(req, res);
  await resetPasswordUseCase.executeAndHandleErrors();
});

export default router;
