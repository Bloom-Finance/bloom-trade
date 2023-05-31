import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', table => {
    table.increments('_id').primary();
    table.string('uid').notNullable();
    table.string('type').notNullable();
    table.bigint('iat').notNullable();
    table.jsonb('destination');
    table.jsonb('total').notNullable();
    table.string('status');
    table.jsonb('from');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('orders');
}
