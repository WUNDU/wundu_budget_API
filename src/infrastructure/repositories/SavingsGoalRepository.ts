import { SavingsGoal } from '../../domain/models/SavingsGoal';
import HttpException from '../exceptions/HttpException';

export interface SavingsGoalRepository {
  create(goal: Partial<SavingsGoal>): Promise<SavingsGoal>;
  findActiveByUserId(userId: string): Promise<SavingsGoal | null>;
}

export class SavingsGoalRepositoryImpl implements SavingsGoalRepository {
  async create(goal: Partial<SavingsGoal>): Promise<SavingsGoal> {
    return SavingsGoal.create(goal);
  }

  async findActiveByUserId(userId: string): Promise<SavingsGoal | null> {
    return SavingsGoal.findOne({ where: { userId } });
  }
}