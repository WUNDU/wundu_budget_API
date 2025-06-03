import { SavingsGoalDTO } from '../../api/dtos/SavingsGoalDTO';
import { SavingsGoal } from '../../domain/models/SavingsGoal';

export interface ISavingsGoalService {
  create(userId: string, dto: SavingsGoalDTO): Promise<SavingsGoal>;
  findActiveByUserId(userId: string): Promise<SavingsGoal | null>;
}