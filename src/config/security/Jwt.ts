import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HttpException from '../../infrastructure/exceptions/HttpException';

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
};

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new HttpException(401, 'Token não fornecido');

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    throw new HttpException(401, 'Token inválido');
  }
};