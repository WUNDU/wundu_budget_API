import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { User } from './User';

export class Transaction extends Model {
  public id!: string;
  public description!: string;
  public amount!: number;
  public type!: 'EXPENSE' | 'REVENUE';
  public category!: string;
  public date!: Date;
  public userId!: string;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('EXPENSE', 'REVENUE'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
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
    modelName: 'Transaction',
    tableName: 'transactions',
    indexes: [{ fields: ['userId', 'date', 'category'] }],
  }
);

Transaction.belongsTo(User, { foreignKey: 'userId' });