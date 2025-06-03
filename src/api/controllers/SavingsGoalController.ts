import { Request, Response } from 'express';
import { ISavingsGoalService } from '../../domain/interfaces/ISavingsGoalService';
import { SavingsGoalDTO } from '../dtos/SavingsGoalDTO';
import { SavingsGoalMapper } from '../mappers/SavingsGoalMapper';
import Joi from 'joi';
import HttpException from '../../infrastructure/exceptions/HttpException';
import { AuthenticatedRequest } from '../../config/security/Jwt';
import { logger } from '../../util/logger';

export class SavingsGoalController {
  private savingsGoalService: ISavingsGoalService;

  constructor(savingsGoalService: ISavingsGoalService) {
    this.savingsGoalService = savingsGoalService;
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const schema = Joi.object({
      targetAmount: Joi.number().positive().required(),
      deadline: Joi.date().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) throw new HttpException(400, error.message);

    const userId = req.user!.id;
    const goalDTO: SavingsGoalDTO = value;
    const goal = await this.savingsGoalService.create(userId, goalDTO);
    logger.info(`Meta de economia criada por usuário ${userId}`);
    res.json({ id: goal.id, ...SavingsGoalMapper.toDTO(goal), userId });
  }
}