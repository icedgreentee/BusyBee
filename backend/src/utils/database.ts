import { Sequelize } from 'sequelize';

let sequelize: Sequelize;

export const connectDatabase = async (): Promise<void> => {
  try {
    const databaseUrl = process.env.DATABASE_URL || 
      `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Database models synchronized');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export const getSequelize = (): Sequelize => {
  if (!sequelize) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return sequelize;
};

export const closeDatabase = async (): Promise<void> => {
  if (sequelize) {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
};
