import { TransactionDTO } from '../../api/dtos/TransactionDTO';
import { Transaction } from '../../domain/models/Transaction';

export interface ITransactionService {
  create(userId: string, dto: TransactionDTO): Promise<Transaction>;
  findByUserId(userId: string, filters?: { startDate?: string; endDate?: string; category?: string }): Promise<Transaction[]>;
  getBalance(userId: string): Promise<number>;
}