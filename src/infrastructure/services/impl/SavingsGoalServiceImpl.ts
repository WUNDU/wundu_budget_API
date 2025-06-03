import { SavingsGoalDTO } from '../../../api/dtos/SavingsGoalDTO';
import { SavingsGoalRepository } from '../../repositories/SavingsGoalRepository';
import { SavingsGoalMapper } from '../../../api/mappers/SavingsGoalMapper';
import { SavingsGoal } from '../../../domain/models/SavingsGoal';
import HttpException from '../../exceptions/HttpException';
import { ISavingsGoalService } from '../../../domain/interfaces/ISavingsGoalService';

export class SavingsGoalServiceImpl implements ISavingsGoalService {
  private savingsGoalRepository: SavingsGoalRepository;

  constructor(savingsGoalRepository: SavingsGoalRepository) {
    this.savingsGoalRepository = savingsGoalRepository;
  }

  async create(userId: string, dto: SavingsGoalDTO): Promise<SavingsGoal> {
    const existingGoal = await this.savingsGoalRepository.findActiveByUserId(userId);
    if (existingGoal) throw new HttpException(400, 'Já existe uma meta ativa');

    if (dto.targetAmount <= 0) throw new HttpException(400, 'O valor alvo deve ser positivo');

    const goal = SavingsGoalMapper.toEntity(dto, userId);
    return this.savingsGoalRepository.create(goal);
  }

  async findActiveByUserId(userId: string): Promise<SavingsGoal | null> {
    return this.savingsGoalRepository.findActiveByUserId(userId);
  }
}