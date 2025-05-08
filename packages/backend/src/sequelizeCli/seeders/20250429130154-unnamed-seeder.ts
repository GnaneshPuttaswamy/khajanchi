import { QueryInterface, Sequelize, Transaction, Op } from 'sequelize';
import { DATABASE_CONSTANTS } from '../../domain/constants/dbConstants.js';

const DEMO_USER_EMAIL = 'demo@gmail.com';

export default {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;
    try {
      dbTransaction = await queryInterface.sequelize.transaction();

      // Find the demo user
      const users = await queryInterface.select(null, DATABASE_CONSTANTS.TABLES.USER, {
        where: { email: DEMO_USER_EMAIL },
        transaction: dbTransaction,
        plain: true, // Expecting only one or zero
      });

      // Check if user exists before attempting deletion
      // The type assertion `any` might be needed depending on how queryInterface.select is typed,
      // or you might need to define an interface for the user structure returned.
      const demoUser = users as any;

      if (demoUser && demoUser.id) {
        // Delete associated transactions first due to potential foreign key constraints
        const deletedTransactions = await queryInterface.bulkDelete(
          DATABASE_CONSTANTS.TABLES.TRANSACTION,
          { userId: demoUser.id },
          { transaction: dbTransaction }
        );

        // Delete the demo user
        const deletedUsers = await queryInterface.bulkDelete(
          DATABASE_CONSTANTS.TABLES.USER,
          { email: DEMO_USER_EMAIL },
          { transaction: dbTransaction }
        );
      } else {
        console.log(`Demo user ${DEMO_USER_EMAIL} not found. No cleanup needed.`);
      }

      await dbTransaction.commit();
    } catch (error) {
      console.error('Error in up seeder: 20250429130154-unnamed-seeder.ts :: error ==> ', error);
      if (dbTransaction!) await dbTransaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    // This 'down' migration is intended to undo the cleanup.
    // Re-creating the specific demo user and transactions is complex and likely not desired.
    // It's often safer to either leave this empty or throw an error indicating
    // that rolling back this specific cleanup seeder is not supported.
    console.log(`'down' migration for 'remove-demo-user-data' is not implemented.`);
    // Optionally, you could throw an error:
    // throw new Error("Undoing the demo user cleanup is not supported.");
  },
};
