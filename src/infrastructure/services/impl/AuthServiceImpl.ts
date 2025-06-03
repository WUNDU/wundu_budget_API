import bcrypt from 'bcrypt';
import { LoginDTO, RegisterDTO } from '../../../api/dtos/AuthDTO';
import { UserRepository } from '../../repositories/UserRepository';
import { generateToken } from '../../../config/security/Jwt';
import HttpException from '../../exceptions/HttpException';
import { IAuthService } from '../../../domain/interfaces/IAuthService';

export class AuthServiceImpl implements IAuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async login(dto: LoginDTO): Promise<string> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new HttpException(401, 'E-mail ou senha inválidos');

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) throw new HttpException(401, 'E-mail ou senha inválidos');

    return generateToken(user.id);
  }

  async register(dto: RegisterDTO): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) throw new HttpException(400, 'E-mail já registrado');

    const user = await this.userRepository.create(dto);
    return generateToken(user.id);
  }
}