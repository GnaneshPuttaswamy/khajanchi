import { TransactionModel } from '../models/TransactionModel.js';
import { BaseRepository } from './BaseRepository.js';

export class TransactionRepository extends BaseRepository<TransactionModel> {
  model() {
    return TransactionModel;
  }
}
