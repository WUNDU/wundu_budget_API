import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Wundu Budget API',
    description: 'API para gerenciamento de finanças pessoais, incluindo autenticação, transações, metas de economia e resumo financeiro.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      LoginDTO: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'test@example.com' },
          password: { type: 'string', example: 'password123' },
        },
        required: ['email', 'password'],
      },
      RegisterDTO: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'test@example.com' },
          password: { type: 'string', example: 'password123' },
        },
        required: ['email', 'password'],
      },
      TransactionDTO: {
        type: 'object',
        properties: {
          description: { type: 'string', example: 'Compra de livro' },
          amount: { type: 'number', example: 50.00 },
          type: { type: 'string', enum: ['EXPENSE', 'REVENUE'], example: 'EXPENSE' },
          category: { type: 'string', example: 'Educação' },
          date: { type: 'string', format: 'date', example: '2025-06-03' },
        },
        required: ['description', 'amount', 'type', 'category', 'date'],
      },
      SavingsGoalDTO: {
        type: 'object',
        properties: {
          targetAmount: { type: 'number', example: 1000.00 },
          deadline: { type: 'string', format: 'date', example: '2025-12-31' },
        },
        required: ['targetAmount', 'deadline'],
      },
      TransactionResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          description: { type: 'string', example: 'Compra de livro' },
          amount: { type: 'number', example: 50.00 },
          type: { type: 'string', example: 'EXPENSE' },
          category: { type: 'string', example: 'Educação' },
          date: { type: 'string', format: 'date-time', example: '2025-06-03T00:00:00.000Z' },
          userId: { type: 'string', example: '1' },
        },
      },
      SavingsGoalResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          targetAmount: { type: 'number', example: 1000.00 },
          deadline: { type: 'string', format: 'date-time', example: '2025-12-31T00:00:00.000Z' },
          userId: { type: 'string', example: '1' },
        },
      },
      FinancialSummaryResponse: {
        type: 'object',
        properties: {
          balance: { type: 'number', example: -50.00 },
          savingsGoalProgress: {
            type: 'object',
            properties: {
              targetAmount: { type: 'number', example: 1000.00 },
              progressPercentage: { type: 'number', example: -5.00 },
            },
            nullable: true,
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Mensagem de erro' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Registrar um novo usuário',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterDTO' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário registrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Erro de validação',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Autenticar um usuário',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginDTO' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuário autenticado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '400': {
            description: 'Erro de validação',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/transactions': {
      post: {
        summary: 'Criar uma nova transação',
        tags: ['Transações'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TransactionDTO' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Transação criada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransactionResponse' },
              },
            },
          },
          '400': {
            description: 'Erro de validação',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        summary: 'Listar transações do usuário',
        tags: ['Transações'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            schema: { type: 'string', format: 'date', example: '2025-06-01' },
            required: false,
            description: 'Data inicial do filtro',
          },
          {
            name: 'endDate',
            in: 'query',
            schema: { type: 'string', format: 'date', example: '2025-06-30' },
            required: false,
            description: 'Data final do filtro',
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string', example: 'Educação' },
            required: false,
            description: 'Categoria do filtro',
          },
        ],
        responses: {
          '200': {
            description: 'Lista de transações',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TransactionResponse' },
                },
              },
            },
          },
          '401': {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/savings-goals': {
      post: {
        summary: 'Criar uma nova meta de economia',
        tags: ['Metas de Economia'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SavingsGoalDTO' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Meta de economia criada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SavingsGoalResponse' },
              },
            },
          },
          '400': {
            description: 'Erro de validação',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/financial-summary': {
      get: {
        summary: 'Obter resumo financeiro do usuário',
        tags: ['Resumo Financeiro'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Resumo financeiro retornado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FinancialSummaryResponse' },
              },
            },
          },
          '401': {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/swagger-ui.html', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};