import express, { Request, Response } from 'express';
import { ParseTransactionsUseCase } from './ParseTransactionsUseCase.js';

const router = express.Router();

router.post('/parse-transactions', async (req: Request, res: Response) => {
  const parseTransactionsUseCase = ParseTransactionsUseCase.create(req, res);
  await parseTransactionsUseCase.executeAndHandleErrors();
});

export default router;
