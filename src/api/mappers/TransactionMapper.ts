import { Transaction  } from  '../../domain/models/Transaction';
import { TransactionDTO } from '../dtos/TransactionDTO';

export class TransactionMapper {
  static toDTO(transaction: Transaction): TransactionDTO {
    return {
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date.toISOString().split('T')[0],
    };
  }

  static toEntity(dto: TransactionDTO, userId: string): Partial<Transaction> {
    return {
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
      category: dto.category,
      date: new Date(dto.date),
      userId,
    };
  }
}