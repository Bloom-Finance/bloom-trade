import knex from 'knex';
import dotenv from 'dotenv';
import config from '../knexfile';
import signale from 'signale';
dotenv.config({ path: '../../../.env' });

async function runMigrations(): Promise<void> {
  const knexInstance = knex(config);
  try {
    signale.pending('Running migrations...');
    await knexInstance.migrate.latest();
    signale.success('Migrations completed successfully');
    signale.pending('Running seeds...');
    await knexInstance.seed.run();
    signale.success('Seeds completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await knexInstance.destroy();
  }
}

runMigrations();
