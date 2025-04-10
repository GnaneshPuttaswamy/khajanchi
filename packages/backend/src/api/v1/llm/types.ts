import { z } from 'zod';

export interface ParseTransactionsRequest {
  transactionsDescription: string;
}

export const TransactionSchema = z.object({
  date: z
    .string()
    .describe(
      'Date and time of transaction in ISO 8601 format (e.g., 2021-09-01T14:30:00Z) if specified else current date and time.'
    ),
  amount: z.number().describe('Amount of the item'),
  category: z.string().describe('One word category of the expense (e.g., food, travel, entertainment)'),
  description: z.string().describe('Concise and short description of the item'),
});

export const TransactionsSchema = z.object({
  transactions: z.array(TransactionSchema),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type ParseTransactionsData = z.infer<typeof TransactionsSchema>;
