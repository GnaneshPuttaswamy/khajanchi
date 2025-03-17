# khajanchi-backend

## Database Migrations Guide

### Setup & Configuration

- Sequelize CLI configuration is managed through `.sequelizerc`
- All paths in `.sequelizerc` are relative to the `dist` folder
- Migration files are generated in `src/sequelizeCli/migrations` but executed from `dist/sequelizeCli/migrations`. This setup allows writing migrations in TypeScript (in src) while running them from the compiled JavaScript (in dist). The generation path is configured in package.json scripts, while the execution path is configured in .sequelizerc.
- Configuration for migrations is in `config.json` (used only for migrations/seeding)

### Migration Workflow

1. Generate migration:

   ```bash
   pnpm run db:migration:generate <migration-name>
   ```

2. Convert generated JS file to TypeScript
3. Replace content with TypeScript migration template given below
4. Build project before running migrations:
   ```bash
   pnpm run build
   pnpm run db:migrate
   ```

### Seeding Workflow

1. Generate seeder:

   ```bash
   pnpm run db:seed:generate <seeder-name>
   ```

2. Convert generated JS file to TypeScript
3. Replace content with TypeScript seeder template given below
4. Build project before running seeders:
   ```bash
   pnpm run build
   pnpm run db:seed:all
   ```

### Migration Template

```typescript
/**
 * Migration template for database changes
 * Up: Applies the migration
 * Down: Reverts the migration
 */
import { QueryInterface, Sequelize, Transaction } from 'sequelize';

export default {
  /**
   * Applies the migration
   * @param {QueryInterface} queryInterface - Interface for making database changes
   * @param {Sequelize} Sequelize - Sequelize instance for accessing data types and utilities
   */
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;

    try {
      // Start a transaction for atomic operations
      // Remove transaction if atomic operations are not required
      dbTransaction = await queryInterface.sequelize.transaction();

      // TODO: Write your migration logic here
      // Example: await queryInterface.createTable(), addColumn(), etc.

      // Commit the transaction if all operations succeed
      await dbTransaction.commit();
    } catch (error) {
      // Rollback all changes if any operation fails
      await dbTransaction!.rollback();
      throw error;
    }
  },

  /**
   * Reverts the migration
   * @param {QueryInterface} queryInterface - Interface for making database changes
   * @param {Sequelize} Sequelize - Sequelize instance for accessing data types and utilities
   */
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;

    try {
      // Start a transaction for atomic operations
      dbTransaction = await queryInterface.sequelize.transaction();

      // TODO: Write your revert logic here
      // Should undo whatever was done in the up function
      // Example: await queryInterface.dropTable(), removeColumn(), etc.

      // Commit the transaction if all operations succeed
      await dbTransaction.commit();
    } catch (error) {
      // Rollback all changes if any operation fails
      await dbTransaction!.rollback();
      throw error;
    }
  },
};
```

### Seeder Template

```typescript
/**
 * Seeder template for populating database with initial/test data
 * Up: Inserts seed data
 * Down: Removes seed data
 */
import { QueryInterface, Sequelize, Transaction } from 'sequelize';

export default {
  /**
   * Inserts seed data into the database
   * @param {QueryInterface} queryInterface - Interface for making database changes
   * @param {Sequelize} Sequelize - Sequelize instance for accessing data types and utilities
   */
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;

    try {
      // Start a transaction for atomic operations
      // Remove transaction if atomic operations are not required
      dbTransaction = await queryInterface.sequelize.transaction();

      // TODO: Write your seeding logic here
      // Example: await queryInterface.bulkInsert(), upsert(), etc.
      // Ensure data validation and consistency
      // Consider using environment variables for environment-specific data

      // Commit the transaction if all operations succeed
      await dbTransaction.commit();
    } catch (error) {
      // Rollback all changes if any operation fails
      await dbTransaction!.rollback();
      throw error;
    }
  },

  /**
   * Removes seed data from the database
   * @param {QueryInterface} queryInterface - Interface for making database changes
   * @param {Sequelize} Sequelize - Sequelize instance for accessing data types and utilities
   */
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;

    try {
      // Start a transaction for atomic operations
      dbTransaction = await queryInterface.sequelize.transaction();

      // TODO: Write your revert logic here
      // Should remove the data added in the up function
      // Example: await queryInterface.bulkDelete(), etc.

      // Commit the transaction if all operations succeed
      await dbTransaction.commit();
    } catch (error) {
      // Rollback all changes if any operation fails
      await dbTransaction!.rollback();
      throw error;
    }
  },
};
```

### Important Guidelines

- Use TypeScript for all migration files
- Always use transactions for atomic operations
- `config.json` should only be used for migrations/seeding
- Build project before running any migration commands

### Available Commands

- `db:migration:generate` - Generate new migration file
- `db:migrate` - Run pending migrations
- `db:migrate:undo` - Revert last migration
- `db:migrate:undo:all` - Revert all migrations
- `db:seed:generate` - Generate new seed file
- `db:seed:all` - Run all seed files
- `db:seed:undo` - Revert last seed
- `db:seed:undo:all` - Revert all seeds
