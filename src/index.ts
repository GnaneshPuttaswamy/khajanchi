import express, { Request, Response } from 'express';
import TransactionRoutes from './api/v1/transaction/routes.js';
import helmet from 'helmet';
import cors from 'cors';
import DateUtil from './core/dateUtil/DateUtil.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());

app.use(cors({ exposedHeaders: ['Content-Disposition'] }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const API_V1 = '/api/v1';

app.get(`${API_V1}/healthcheck`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new DateUtil().toISOString(new Date()),
    version: 'v1',
    service: 'khajanchi-backend',
  });
});

app.use(`${API_V1}`, TransactionRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
