import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { ParseTransactionsData, ParseTransactionsRequest, TransactionsSchema } from './types.js';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { logger } from '../../../core/logger/logger.js';

export class ParseTransactionsUseCase extends BaseUseCase<{}, {}, ParseTransactionsRequest, {}, ParseTransactionsData> {
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
      throw new Error('transactionsDescription field is required');
    }
  }

  async execute() {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      logger.debug('Starting OpenAI API call for transaction parsing');

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

      const refusal = completion.choices[0].message.refusal;
      if (refusal) {
        logger.info('OpenAI API refused to process transaction request', {
          refusal: refusal,
        });
        throw new Error(refusal);
      }

      const parsedTransactions = completion.choices[0].message.parsed as unknown as ParseTransactionsData;
      logger.debug('Successfully parsed transactions', { count: parsedTransactions?.transactions?.length });
      return parsedTransactions;
    } catch (error) {
      logger.error('ParseTransactionsUseCase.execute() error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, ParseTransactionsRequest, {}>, response: Response) {
    return new ParseTransactionsUseCase(request, response, new TransactionRepository());
  }
}
