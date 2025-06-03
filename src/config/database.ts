import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Para conexões Railway, desativa verificação estrita de SSL
    },
  },
});

sequelize.authenticate()
  .then(() => console.log('✅ Conexão bem-sucedida com o banco de dados'))
  .catch((error) => console.error('❌ Erro de conexão:', error));

export default sequelize;
