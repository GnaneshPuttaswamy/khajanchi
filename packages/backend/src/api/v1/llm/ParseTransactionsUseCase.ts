import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { ParseTransactionsData, ParseTransactionsRequest } from './types.js';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

export class ParseTransactionsUseCase extends BaseUseCase<
  {},
  {},
  ParseTransactionsRequest,
  {},
  ParseTransactionsData[]
> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<{}, {}, ParseTransactionsRequest, {}>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    if (!this.request.body.transactionsDescription) {
      throw new Error('Transactions description is required');
    }
  }

  async execute() {
    const TransactionSchema = z.object({
      date: z
        .string()
        .describe("Date of transaction in ISO 8601 format (e.g., 2021-09-01) if specified else today's date."),
      amount: z.number().describe('Amount of the item'),
      category: z.string().describe('One word category of the expense (e.g., food, travel, entertainment)'),
      description: z.string().describe('Concise and short description of the item'),
    });

    const TransactionsSchema = z.object({
      transactions: z.array(TransactionSchema),
    });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        {
          role: 'system',
          content: `You will be provided with spends done by the user in natural language. Your task is to parse and categorise the expenses in valid categories. If the given input doesn't contain any data about the expenses then return an error. Today's date is ${new Date().toISOString().split('T')[0]}`,
        },
        {
          role: 'user',
          content: this.request.body.transactionsDescription,
        },
      ],
      response_format: zodResponseFormat(TransactionsSchema, 'transactions'),
    });

    if (completion.choices[0].message.refusal) {
      throw new Error(completion.choices[0].message.refusal);
    }

    return completion.choices[0].message.parsed as unknown as ParseTransactionsData[];
  }

  static create(request: Request<{}, {}, ParseTransactionsRequest, {}>, response: Response) {
    return new ParseTransactionsUseCase(request, response, new TransactionRepository());
  }
}
