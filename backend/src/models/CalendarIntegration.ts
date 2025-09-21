import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/database';

interface CalendarIntegrationAttributes {
  id: string;
  userId: string;
  provider: 'google' | 'microsoft' | 'apple' | 'notion';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarIntegrationCreationAttributes extends Optional<CalendarIntegrationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class CalendarIntegration extends Model<CalendarIntegrationAttributes, CalendarIntegrationCreationAttributes> implements CalendarIntegrationAttributes {
  public id!: string;
  public userId!: string;
  public provider!: 'google' | 'microsoft' | 'apple' | 'notion';
  public accessToken!: string;
  public refreshToken?: string;
  public expiresAt?: Date;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CalendarIntegration.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    provider: {
      type: DataTypes.ENUM('google', 'microsoft', 'apple', 'notion'),
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: getSequelize(),
    modelName: 'CalendarIntegration',
    tableName: 'calendar_integrations',
    timestamps: true,
  }
);

export default CalendarIntegration;
