import { User } from '../../domain/models/User';
import bcrypt from 'bcrypt';
import HttpException from '../exceptions/HttpException';
import { RegisterDTO } from '../../api/dtos/AuthDTO';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(dto: RegisterDTO): Promise<User>;
}

export class UserRepositoryImpl implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async create(dto: RegisterDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return User.create({ email: dto.email, password: hashedPassword });
  }
}