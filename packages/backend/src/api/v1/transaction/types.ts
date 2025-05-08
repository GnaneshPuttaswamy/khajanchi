import { z } from 'zod';
import DateUtil from '../../../core/dateUtil/DateUtil.js';
import { IdParams } from '../../../core/zodSchemas/zodSchemas.js';

const dateUtil = DateUtil.getInstance();

// AddTransactionUseCase
export type AddTransactionData = {
  id: number;
  date: Date;
  amount: number;
  category: string;
  description: string;
  isConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const addTransactionRequestSchema = z.object({
  date: z.preprocess(
    (val) => dateUtil.toUTCDate(val as any),
    z.date({
      required_error: 'Date is required',
      invalid_type_error: 'Invalid date format',
    })
  ),
  amount: z.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  }),
  category: z.string({
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  isConfirmed: z.boolean().optional().default(false),
});

export type AddTransactionRequest = z.infer<typeof addTransactionRequestSchema>;

// BulkAddTransactionUseCase
export type BulkAddTransactionData = AddTransactionData[];

export const bulkAddTransactionRequestSchema = z.object({
  transactions: z.array(addTransactionRequestSchema),
});

export type BulkAddTransactionRequest = z.infer<typeof bulkAddTransactionRequestSchema>;

// GetTransactionUseCase
export type GetTransactionParams = IdParams;
export type GetTransactionData = AddTransactionData;

// GetAllTransactionsUseCase
export const getAllTransactionsQuerySchema = z.object({
  isConfirmed: z.preprocess((val) => val === 'true', z.boolean().optional().default(false)),
  pageSize: z.string().optional(),
  pageNumber: z.string().optional(),
  sortBy: z.union([z.string(), z.array(z.string())]).optional(),
  sortOrder: z.union([z.enum(['ASC', 'DESC']), z.array(z.enum(['ASC', 'DESC']))]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  categories: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return [val];
      }

      if (Array.isArray(val) && val.length > 0) {
        return val;
      }

      return null;
    },
    z.union([z.string(), z.array(z.string()), z.null()]).optional()
  ),
});
export type GetAllTransactionsQuery = z.infer<typeof getAllTransactionsQuerySchema>;

export type GetAllTransactionsData = AddTransactionData;

// DeleteTransactionUseCase
export type DeleteTransactionParams = IdParams;
export interface DeleteTransactionData {
  deletedCount: number;
}

// UpdateTransactionUseCase
export const updateTransactionRequestSchema = z.object({
  date: z.preprocess(
    (val) => dateUtil.toUTCDate(val as any),
    z.date({
      required_error: 'Date is required',
      invalid_type_error: 'Invalid date format',
    })
  ),
  amount: z.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  }),
  category: z.string({
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  isConfirmed: z.boolean().optional().default(false),
});

export type UpdateTransactionParams = IdParams;
export type UpdateTransactionRequest = z.infer<typeof updateTransactionRequestSchema>;
