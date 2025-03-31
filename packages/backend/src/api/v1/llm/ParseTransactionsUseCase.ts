import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { ParseTransactionsData, ParseTransactionsRequest, TransactionsSchema } from './types.js';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { logger } from '../../../core/logger/logger.js';
import DateUtil from '../../../core/dateUtil/DateUtil.js';

export class ParseTransactionsUseCase extends BaseUseCase<{}, {}, ParseTransactionsRequest, {}, ParseTransactionsData> {
  transactionRepository: TransactionRepository;
  dateUtil: DateUtil;

  constructor(
    request: Request<{}, {}, ParseTransactionsRequest, {}>,
    response: Response,
    transactionRepository: TransactionRepository,
    dateUtil: DateUtil
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
    this.dateUtil = dateUtil;
  }

  async validate() {
    if (!this.request.body.transactionsDescription) {
      throw new Error('transactionsDescription field is required');
    }
  }

  async execute() {
    try {
      logger.debug('ParseTransactionsUseCase.execute() :: Starting OpenAI API call for transaction parsing');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const todaysDate = this.dateUtil.toISOString(this.dateUtil.getCurrentDateInUTC());
      logger.debug('ParseTransactionsUseCase.execute() :: todaysDate', todaysDate);

      const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          {
            role: 'system',
            content: `You will receive a description of expenses written in natural language. Your task is to extract individual transactions and represent them in structured format with the following fields:
      
            - date: ISO 8601 format (e.g., 2021-09-01T14:30:00Z). If the date is not mentioned, use today's date: ${todaysDate}.
            - amount: Numeric value of the expense.
            - category: A one-word category inferred from the context (e.g., food, travel, shopping).
            - description: A short and concise description of the transaction.
            
            If the input does not mention any valid expenses, return an error instead of a parsed response.`,
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
        logger.debug('ParseTransactionsUseCase.execute() :: OpenAI API refused to process transaction request', {
          refusal: refusal,
        });
        throw new Error(refusal);
      }

      const parsedTransactions = completion.choices[0].message.parsed as unknown as ParseTransactionsData;

      logger.debug('ParseTransactionsUseCase.execute() :: Successfully parsed transactions', parsedTransactions);
      return parsedTransactions;
    } catch (error) {
      logger.error('ParseTransactionsUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, ParseTransactionsRequest, {}>, response: Response) {
    return new ParseTransactionsUseCase(request, response, new TransactionRepository(), DateUtil.getInstance());
  }
}
