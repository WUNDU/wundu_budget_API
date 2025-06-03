import { Transaction } from '../../domain/models/Transaction';
import { Op } from 'sequelize';

export interface TransactionRepository {
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  findByUserId(userId: string, filters?: { startDate?: string; endDate?: string; category?: string }): Promise<Transaction[]>;
  getBalance(userId: string): Promise<number>;
}

export class TransactionRepositoryImpl implements TransactionRepository {
  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    return Transaction.create(transaction);
  }

  async findByUserId(userId: string, filters?: { startDate?: string; endDate?: string; category?: string }): Promise<Transaction[]> {
    const where: any = { userId };
    if (filters?.startDate) where.date = { [Op.gte]: new Date(filters.startDate) };
    if (filters?.endDate) where.date = { ...where.date, [Op.lte]: new Date(filters.endDate) };
    if (filters?.category) where.category = filters.category;
    return Transaction.findAll({ where, order: [['date', 'DESC']] });
  }

  async getBalance(userId: string): Promise<number> {
    const transactions = await Transaction.findAll({ where: { userId } });
    return transactions.reduce((balance, t) => {
      return t.type === 'REVENUE' ? balance + t.amount : balance - t.amount;
    }, 0);
  }
}