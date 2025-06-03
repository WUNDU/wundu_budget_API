import { Request, Response } from 'express';
import { ITransactionService } from '../../domain/interfaces/ITransactionService';
import { ISavingsGoalService } from '../../domain/interfaces/ISavingsGoalService';
import { AuthenticatedRequest } from '../../config/security/Jwt';
import { logger } from '../../util/logger';

export class FinancialSummaryController {
  private transactionService: ITransactionService;
  private savingsGoalService: ISavingsGoalService;

  constructor(transactionService: ITransactionService, savingsGoalService: ISavingsGoalService) {
    this.transactionService = transactionService;
    this.savingsGoalService = savingsGoalService;
  }

  async getSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const balance = await this.transactionService.getBalance(userId);
    const goal = await this.savingsGoalService.findActiveByUserId(userId);

    const summary: any = { balance };
    if (goal) {
      const progressPercentage = (balance / goal.targetAmount) * 100;
      summary.savingsGoalProgress = {
        targetAmount: goal.targetAmount,
        progressPercentage: parseFloat(progressPercentage.toFixed(2)),
      };
    } else {
      summary.savingsGoalProgress = null;
    }

    logger.info(`Resumo financeiro consultado por usuário ${userId}`);
    res.json(summary);
  }
}