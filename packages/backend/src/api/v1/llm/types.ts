import { z } from 'zod';

export interface ParseTransactionsRequest {
  transactionsDescription: string;
}

export const TransactionSchema = z.object({
  date: z
    .string()
    .describe(
      'Date and time of transaction in ISO 8601 format (e.g., 2021-09-01T14:30:00Z). If no date/time mentioned, use the current date/time provided in the system prompt.'
    ),
  amount: z
    .number()
    .int()
    .describe(
      'Integer amount of the transaction in the smallest currency unit (paise for INR). Example: ₹123.45 should be represented as 12345.'
    ),
  category: z
    .string()
    .describe('A single-word category classifying the expense (e.g., food, travel, shopping, utilities).'),
  description: z.string().describe('A short, concise description of the transaction item or service.'),
});

export const TransactionsSchema = z.object({
  transactions: z.array(TransactionSchema).describe('An array containing all the extracted transaction objects.'),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type ParseTransactionsData = z.infer<typeof TransactionsSchema>;
