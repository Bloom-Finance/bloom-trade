import {Knex} from 'knex';
import {customAlphabet} from 'nanoid';
exports.seed = async function (knex: Knex) {
  // Clear existing data from the table (optional)
  await knex('vaults').truncate();

  // Example data
  await knex('vaults').insert([
    {
      address: '0xe14D7b23B9239ABda519A300D530707689019F4e',
      chain: 'goerli',
    },
    {
      address: '0x472444638Eefc03a5618F69C189b29b32f91920A',
      chain: 'polygon',
    },
  ]);
};
