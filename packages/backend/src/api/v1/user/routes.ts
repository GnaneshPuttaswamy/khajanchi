import express, { Request, Response } from 'express';
import { GetUserProfileUseCase } from './GetUserProfileUseCase.js';
import GoogleSignInUseCase from './GoogleSignInUseCase.js';

const router = express.Router();

router.get('/users/profile', async (req: Request, res: Response) => {
  const getUserProfileUseCase = GetUserProfileUseCase.create(req, res);
  await getUserProfileUseCase.executeAndHandleErrors();
});

router.post('/users/google/login', async (req: Request, res: Response) => {
  const googleSignInUseCase = GoogleSignInUseCase.create(req, res);
  await googleSignInUseCase.executeAndHandleErrors();
});

export default router;
