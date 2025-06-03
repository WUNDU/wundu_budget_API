import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('✅ Conexão bem-sucedida com o banco de dados'))
  .catch((error) => console.error('❌ Erro de conexão:', error));

export default sequelize;