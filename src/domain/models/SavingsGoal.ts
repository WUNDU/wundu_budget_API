import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { User } from './User';

export class SavingsGoal extends Model {
  public id!: string;
  public targetAmount!: number;
  public deadline!: Date;
  public userId!: string;
}

SavingsGoal.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    targetAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SavingsGoal',
    tableName: 'savings_goals',
    indexes: [{ fields: ['userId'] }],
  }
);

SavingsGoal.belongsTo(User, { foreignKey: 'userId' });