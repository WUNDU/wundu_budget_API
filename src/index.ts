import express, { Request, Response, NextFunction } from 'express';
import { setupSwagger } from '../src/config/swagger/SwaggerConfig';
import { AuthController } from '../src/api/controllers/AuthController';
import { TransactionController } from '../src/api/controllers/TransactionController';
import { SavingsGoalController } from '../src/api/controllers/SavingsGoalController';
import { FinancialSummaryController } from '../src/api/controllers/FinancialSummaryController';
import { UserRepositoryImpl } from '../src/infrastructure/repositories/UserRepository';
import { TransactionRepositoryImpl } from '../src/infrastructure/repositories/TransactionRepository';
import { SavingsGoalRepositoryImpl } from '../src/infrastructure/repositories/SavingsGoalRepository';
import { AuthServiceImpl } from '../src/infrastructure/services/impl/AuthServiceImpl';
import { TransactionServiceImpl } from '../src/infrastructure/services/impl/TransactionServiceImpl';
import { SavingsGoalServiceImpl } from '../src/infrastructure/services/impl/SavingsGoalServiceImpl';
import sequelize from '../src/config/database';
import { authenticateJWT } from '../src/config/security/Jwt';
import HttpException from '../src/infrastructure/exceptions/HttpException';
import { logger } from '../src/util/logger';

const app = express();
app.use(express.json());

// Inicializar banco de dados
sequelize.sync({ force: true }).then(() => {
  logger.info('Banco de dados sincronizado');
});

// Configurar Swagger
setupSwagger(app);

// Injeção de dependências
const userRepository = new UserRepositoryImpl();
const transactionRepository = new TransactionRepositoryImpl();
const savingsGoalRepository = new SavingsGoalRepositoryImpl();
const authService = new AuthServiceImpl(userRepository);
const transactionService = new TransactionServiceImpl(transactionRepository);
const savingsGoalService = new SavingsGoalServiceImpl(savingsGoalRepository);
const authController = new AuthController(authService);
const transactionController = new TransactionController(transactionService);
const savingsGoalController = new SavingsGoalController(savingsGoalService);
const financialSummaryController = new FinancialSummaryController(transactionService, savingsGoalService);

// Rotas
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/transactions', authenticateJWT, (req, res) => transactionController.create(req, res));
app.get('/api/transactions', authenticateJWT, (req, res) => transactionController.find(req, res));
app.post('/api/savings-goals', authenticateJWT, (req, res) => savingsGoalController.create(req, res));
app.get('/api/financial-summary', authenticateJWT, (req, res) => financialSummaryController.getSummary(req, res));

// Tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpException) {
    logger.error(`Erro ${err.status}: ${err.message}`);
    res.status(err.status).json({ error: err.message });
  } else {
    logger.error(`Erro interno: ${err.message}`);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(3000, () => {
  logger.info('Servidor rodando na porta 3000');
});