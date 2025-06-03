import { TransactionDTO } from '../../../api/dtos/TransactionDTO';
import { TransactionRepository } from '../../repositories/TransactionRepository';
import { TransactionMapper } from '../../../api/mappers/TransactionMapper';
import { Transaction } from '../../../domain/models/Transaction';
import HttpException from '../../exceptions/HttpException';
import { ITransactionService } from '../../../domain/interfaces/ITransactionService';

export class TransactionServiceImpl implements ITransactionService {
  private transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async create(userId: string, dto: TransactionDTO): Promise<Transaction> {
    if (dto.amount <= 0) throw new HttpException(400, 'O valor deve ser positivo');
    if (!['EXPENSE', 'REVENUE'].includes(dto.type)) throw new HttpException(400, 'Tipo inválido');

    const transaction = TransactionMapper.toEntity(dto, userId);
    return this.transactionRepository.create(transaction);
  }

  async findByUserId(userId: string, filters?: { startDate?: string; endDate?: string; category?: string }): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId, filters);
  }

  async getBalance(userId: string): Promise<number> {
    return this.transactionRepository.getBalance(userId);
  }
}