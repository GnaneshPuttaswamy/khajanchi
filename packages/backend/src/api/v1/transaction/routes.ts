import express, { Request, Response } from 'express';
import { AddTransactionUseCase } from './AddTransactionUseCase.js';
import { GetTransactionUseCase } from './GetTransactionUseCase.js';
import { DeleteTransactionUseCase } from './DeleteTransactionUseCase.js';
import { GetAllTransactionsUseCase } from './GetAllTransactionsUseCase.js';
import {
  DeleteTransactionParams,
  GetAllTransactionsQuery,
  GetTransactionParams,
  UpdateTransactionParams,
} from './types.js';
import { UpdateTransactionUseCase } from './UpdateTransactionUseCase.js';

const router = express.Router();

router.post('/transactions', async (req: Request, res: Response) => {
  const addTransactionUseCase = AddTransactionUseCase.create(req, res);
  await addTransactionUseCase.executeAndHandleErrors();
});

router.get('/transactions', async (req: Request<{}, {}, GetAllTransactionsQuery, {}>, res: Response) => {
  const getAllTransactionsUseCase = GetAllTransactionsUseCase.create(req, res);
  await getAllTransactionsUseCase.executeAndHandleErrors();
});

router.get('/transactions/:id', async (req: Request<GetTransactionParams>, res: Response) => {
  const getTransactionUseCase = GetTransactionUseCase.create(req, res);
  await getTransactionUseCase.executeAndHandleErrors();
});

router.delete('/transactions/:id', async (req: Request<DeleteTransactionParams>, res: Response) => {
  const deleteTransactionUseCase = DeleteTransactionUseCase.create(req, res);
  await deleteTransactionUseCase.executeAndHandleErrors();
});

router.put('/transactions/:id', async (req: Request<UpdateTransactionParams>, res: Response) => {
  const updateTransactionUseCase = UpdateTransactionUseCase.create(req, res);
  await updateTransactionUseCase.executeAndHandleErrors();
});

export default router;
