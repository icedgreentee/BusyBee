import { connectDatabase, getSequelize } from './database';
import User from '../models/User';
import CalendarIntegration from '../models/CalendarIntegration';

export const initializeDatabase = async () => {
  try {
    await connectDatabase();
    
    // Define associations
    User.hasMany(CalendarIntegration, { 
      foreignKey: 'userId', 
      as: 'integrations' 
    });
    CalendarIntegration.belongsTo(User, { 
      foreignKey: 'userId', 
      as: 'user' 
    });

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}
