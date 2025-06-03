import { SavingsGoal } from '../../domain/models/SavingsGoal';
import { SavingsGoalDTO } from '../dtos/SavingsGoalDTO';

export class SavingsGoalMapper {
  static toDTO(goal: SavingsGoal): SavingsGoalDTO {
    return {
      targetAmount: goal.targetAmount,
      deadline: goal.deadline.toISOString().split('T')[0],
    };
  }

  static toEntity(dto: SavingsGoalDTO, userId: string): Partial<SavingsGoal> {
    return {
      targetAmount: dto.targetAmount,
      deadline: new Date(dto.deadline),
      userId,
    };
  }
}