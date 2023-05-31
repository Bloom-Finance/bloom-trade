import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('vaults', table => {
    table.increments('_id').primary();
    table.string('address').notNullable();
    table.string('chain').notNullable();
    table.string('uid').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('vaults');
}
