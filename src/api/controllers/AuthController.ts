import { Request, Response } from 'express';
import { IAuthService } from '../../domain/interfaces/IAuthService';
import { LoginDTO, RegisterDTO } from '../dtos/AuthDTO';
import Joi from 'joi';
import HttpException from '../../infrastructure/exceptions/HttpException';
import { logger } from '../../util/logger';

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async login(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) throw new HttpException(400, error.message);

    const loginDTO: LoginDTO = value;
    const token = await this.authService.login(loginDTO);
    logger.info(`Usuário autenticado: ${loginDTO.email}`);
    res.json({ token });
  }

  async register(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) throw new HttpException(400, error.message);

    const registerDTO: RegisterDTO = value;
    const token = await this.authService.register(registerDTO);
    logger.info(`Novo usuário registrado: ${registerDTO.email}`);
    res.status(201).json({ token });
  }
}