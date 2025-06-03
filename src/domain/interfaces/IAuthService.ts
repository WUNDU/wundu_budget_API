import { LoginDTO, RegisterDTO } from '../../api/dtos/AuthDTO';

export interface IAuthService {
  login(dto: LoginDTO): Promise<string>;
  register(dto: RegisterDTO): Promise<string>;
}