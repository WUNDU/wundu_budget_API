import { Request, Response } from 'express';
import { ITransactionService } from '../../domain/interfaces/ITransactionService';
import { TransactionDTO } from '../dtos/TransactionDTO';
import { TransactionMapper } from '../mappers/TransactionMapper';
import Joi from 'joi';
import HttpException from '../../infrastructure/exceptions/HttpException';
import { AuthenticatedRequest } from '../../config/security/Jwt';
import { logger } from '../../util/logger';

export class TransactionController {
  private transactionService: ITransactionService;

  constructor(transactionService: ITransactionService) {
    this.transactionService = transactionService;
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const schema = Joi.object({
      description: Joi.string().required(),
      amount: Joi.number().positive().required(),
      type: Joi.string().valid('EXPENSE', 'REVENUE').required(),
      category: Joi.string().required(),
      date: Joi.date().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) throw new HttpException(400, error.message);

    const userId = req.user!.id;
    const transactionDTO: TransactionDTO = value;
    const transaction = await this.transactionService.create(userId, transactionDTO);
    logger.info(`Transação criada por usuário ${userId}: ${transaction.description}`);
    res.json(TransactionMapper.toDTO(transaction));
  }

  async find(req: AuthenticatedRequest, res: Response): Promise<void> {
    const schema = Joi.object({
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      category: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.query);
    if (error) throw new HttpException(400, error.message);

    const userId = req.user!.id;
    const transactions = await this.transactionService.findByUserId(userId, value);
    logger.info(`Transações consultadas por usuário ${userId}`);
    res.json(transactions.map(TransactionMapper.toDTO));
  }
}